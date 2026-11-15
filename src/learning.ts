import type { Exercise } from './types';
export function answerFor(page: Exercise): number { return page.answer ?? (page.operands ? page.operation === '-' ? page.operands[0] - page.operands[1] : page.operands[0] + page.operands[1] : page.count ?? 0); }
export function numberChoices(answer: number): number[] { const values = new Set([answer]); for (const n of [answer + 1, answer - 1, answer + 2, answer - 2]) if(n >= 0 && n <= 20 && values.size < 3) values.add(n); return [...values].sort((a,b)=>a-b); }
export const plain = (value: string) => value.normalize('NFD').replace(/[\u0591-\u05C7]/g, '').normalize('NFC');
export function graphemes(value: string): string[] { const out: string[] = []; for (const letter of value) { if (/[\u0591-\u05C7]/.test(letter) && out.length) out[out.length-1] += letter; else out.push(letter); } return out; }
export const progressKey = (lessonId: string, pageId: string) => `${lessonId}/${pageId}`;
export function parseProgress(value: unknown): Record<string, true> { if (!value || typeof value !== 'object' || Array.isArray(value)) throw Error('Invalid progress'); const data = value as Record<string, unknown>; const completed = data.completed ?? value; if (!completed || typeof completed !== 'object' || Array.isArray(completed)) throw Error('Invalid progress'); const result: Record<string, true> = {}; for(const [key,val] of Object.entries(completed)) { if(val !== true || key.length > 200 || !key.includes('/')) throw Error('Invalid progress'); result[key] = true; } return result; }

/** Forgiving globally, but no whole stroke can be skipped (e.g. an arm of א). */
export function traceComplete(strokes: {covered:number;total:number}[]): boolean {
  const total=strokes.reduce((sum,stroke)=>sum+stroke.total,0);
  const covered=strokes.reduce((sum,stroke)=>sum+stroke.covered,0);
  return total>0 && covered/total>=.75 && strokes.every(stroke=>stroke.total>0 && stroke.covered/stroke.total>=.5);
}
