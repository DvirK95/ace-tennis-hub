import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const apiFile = join(root, 'src/schemas/api.ts');
const modelsFile = join(root, 'src/schemas/models.ts');

const content = readFileSync(apiFile, 'utf8');
const lines = content.split('\n');

// ── Find the split point (first lowercase `export const`) ────────────────────
let fnStartIdx = lines.findIndex(l => /^export const [a-z]/.test(l));

if (fnStartIdx === -1) {
  console.log('No functions found — nothing to split.');
  process.exit(0);
}

// Walk backwards to include any JSDoc comment that belongs to the first function
{
  let j = fnStartIdx - 1;
  while (j >= 0 && lines[j].trim() === '') j--;
  if (j >= 0 && (lines[j].trim() === '*/' || lines[j].trim().startsWith('* '))) {
    while (j >= 0 && !lines[j].trim().startsWith('/**')) j--;
    fnStartIdx = j;
  }
}

const rawTypeLines = lines.slice(0, fnStartIdx);
const rawFnLines = lines.slice(fnStartIdx);

// ── Separate header / mutator import / type declarations ─────────────────────
const headerLines = [];
const mutatorImportLine = [];
const modelLines = [];

let pastHeader = false;
for (const line of rawTypeLines) {
  if (!pastHeader) {
    if (line.startsWith('/**') || line.startsWith(' *') || line === '') {
      headerLines.push(line);
      continue;
    }
    pastHeader = true;
  }
  if (line.startsWith('import ') && line.includes('orvalMutator')) {
    mutatorImportLine.push(line);
  } else {
    modelLines.push(line);
  }
}

// Guard: skip if already split
const hasTypeDeclarations = modelLines.some(l => /^export (type|interface|const [A-Z])/.test(l));
if (!hasTypeDeclarations) {
  console.log('Already split — skipping.');
  process.exit(0);
}

// ── Parse orval function blocks ───────────────────────────────────────────────
// Each block = optional JSDoc + `export const fnName = (...) => { ... }`
function parseFunctionBlocks(lines) {
  const blocks = [];
  let current = null;
  let braceDepth = 0;
  let enteredBody = false; // true once we've seen the opening { of the fn body

  for (const line of lines) {
    if (/^export type \w+Result\s*=/.test(line)) continue;

    if (current === null) {
      if (/^(\/\*\*|export const [a-z])/.test(line)) {
        current = [];
        braceDepth = 0;
        enteredBody = false;
      }
    }

    if (current !== null) {
      current.push(line);
      braceDepth += (line.match(/\{/g) || []).length;
      braceDepth -= (line.match(/\}/g) || []).length;

      if (braceDepth > 0) enteredBody = true;

      // End the block only after we've entered the body and closed back to 0
      if (enteredBody && braceDepth === 0) {
        blocks.push(current);
        current = null;
        enteredBody = false;
      }
    }
  }
  return blocks;
}

// ── Convert a function block to an inline method ──────────────────────────────
function inlineFunction(block) {
  const text = block.join('\n');

  // Function name
  const nameMatch = text.match(/^export const ([a-z]\w+)/m);
  if (!nameMatch) return null;
  const fnName = nameMatch[1];

  // Tag from URL: /api/(tag)/
  const urlMatch = text.match(/url:\s*`\/api\/(\w+)\//);
  if (!urlMatch) return null;
  const tag = urlMatch[1].toLowerCase();

  // Op name: strip (method)Api(Tag) prefix, lowercase first char
  const methodMatch = fnName.match(/^(get|post|put|patch|delete)/i);
  if (!methodMatch) return null;
  const tagCap = tag[0].toUpperCase() + tag.slice(1);
  const prefix = `${methodMatch[1]}Api${tagCap}`;
  const opRaw = fnName.slice(prefix.length);
  const opName = opRaw[0].toLowerCase() + opRaw.slice(1);

  // Parameters: between `= (` and `) =>`
  const paramsMatch = text.match(/=\s*\(([\s\S]*?)\)\s*=>/);
  const params = (paramsMatch?.[1] ?? '')
    .replace(/,\s*$/, '')     // trailing comma
    .replace(/\s+/g, ' ')     // collapse whitespace
    .trim();

  // Return type generic from customInstance<T>
  const typeMatch = text.match(/customInstance<([^>]+)>/);
  const returnType = typeMatch?.[1] ?? 'unknown';

  // Options object: brace-count from the `{` after `customInstance<T>(`
  const ciIdx = text.indexOf('customInstance');
  const braceStart = text.indexOf('{', ciIdx);
  let depth = 0, i = braceStart, end = braceStart;
  while (i < text.length) {
    if (text[i] === '{') depth++;
    else if (text[i] === '}') { depth--; if (depth === 0) { end = i; break; } }
    i++;
  }
  const options = text
    .slice(braceStart, end + 1)
    .replace(/\s+/g, ' ')
    .trim();

  return { tag, opName, line: `    ${opName}: (${params}) => customInstance<${returnType}>(${options})` };
}

// ── Build grouped api object ──────────────────────────────────────────────────
const blocks = parseFunctionBlocks(rawFnLines);
const groups = {};

for (const block of blocks) {
  const result = inlineFunction(block);
  if (!result) continue;
  const { tag, opName, line } = result;
  if (!groups[tag]) groups[tag] = [];
  groups[tag].push(line);
}

const apiObjectBody = Object.entries(groups)
  .map(([tag, methods]) => `  ${tag}: {\n${methods.join(',\n')},\n  }`)
  .join(',\n');

const apiExport = `export const api = {\n${apiObjectBody},\n};\n`;

// ── Collect which model names are used in the api object ─────────────────────
const allModelNames = [
  ...[...modelLines.join('\n').matchAll(/^export (?:type |interface |const )(\w+)/gm)].map(m => m[1]),
];
const usedTypes = allModelNames.filter(name => new RegExp(`\\b${name}\\b`).test(apiExport));

// ── Write models.ts ───────────────────────────────────────────────────────────
const modelsContent =
  [...headerLines, '', ...modelLines]
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim() + '\n';

writeFileSync(modelsFile, modelsContent);

// ── Write api.ts ──────────────────────────────────────────────────────────────
const modelsImport =
  usedTypes.length > 0 ? `import type { ${usedTypes.join(', ')} } from './models';` : '';

const apiContent = [
  ...headerLines,
  '',
  ...mutatorImportLine,
  ...(modelsImport ? [modelsImport] : []),
  '',
  apiExport,
]
  .join('\n')
  .replace(/\n{3,}/g, '\n\n')
  .trim() + '\n';

writeFileSync(apiFile, apiContent);

console.log('✅ models.ts (types) + api.ts (api object) generated');
