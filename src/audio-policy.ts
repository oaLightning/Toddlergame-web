const keyIds: Record<string, string> = { 'אלף': 'alef', 'בית': 'bet', 'גימל': 'gimel', 'דלת': 'dalet' };
export function speechClipId(text: string, locale: string): string | undefined {
  if (/^(?:0|[1-9]|1[0-9]|20)$/.test(text)) return `number.${locale === 'he' ? 'he' : 'en'}.${text}`;
  if (locale === 'he' && keyIds[text]) return `key.he.${keyIds[text]}`;
  if (locale === 'en' && /^[astm]$/i.test(text)) return `key.en.${text.toLowerCase()}`;
  return undefined;
}
