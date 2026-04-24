import { defineConfig } from 'orval';
import { loadEnv } from 'vite';

// Load env vars the same way Vite does (reads .env.dev, .env.local, etc.)
const env = loadEnv('dev', process.cwd(), '');
const backendUrl = env.VITE_API_URL;

export default defineConfig({
  aceclub: {
    input: {
      target: `${backendUrl}/api-json`,
    },
    output: {
      mode: 'single',
      target: 'src/schemas/api.ts',
      client: 'axios-functions',
      override: {
        mutator: {
          path: 'src/lib/orvalMutator.ts',
          name: 'customInstance',
        },
      },
    },
  },
});
