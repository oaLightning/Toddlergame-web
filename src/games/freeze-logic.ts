export function freezeDuration(index: number, frozenCount: number): number {
  return Math.max(1.2, (7 + index % 3 * 1.1) / Math.pow(1.28, Math.max(0, frozenCount)));
}
