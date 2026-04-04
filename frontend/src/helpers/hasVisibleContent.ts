import type { ReactNode } from 'react';

export function hasVisibleContent(node: ReactNode): boolean {
  if (node == null || node === false) return false;
  if (typeof node === 'string' || typeof node === 'number') return String(node).trim().length > 0;
  if (Array.isArray(node)) return node.some(hasVisibleContent);
  return true;
}
