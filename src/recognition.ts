/** Stable across re-renders, varied across exercises. Instructions never use this. */
export function recognitionClass(seed: string, variant = 0): string {
  let hash = 0;
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return `recognition-font-${(hash + variant) % 4}`;
}
