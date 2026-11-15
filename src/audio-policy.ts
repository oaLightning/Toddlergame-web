const keyIds: Record<string, string> = { 'אלף': 'alef', 'בית': 'bet', 'גימל': 'gimel', 'דלת': 'dalet', 'הא':'he', 'וו':'vav', 'זין':'zayin', 'חית':'het', 'טית':'tet', 'יוד':'yod', 'כף':'kaf', 'למד':'lamed', 'מם':'mem', 'נון':'nun', 'סמך':'samekh', 'עין':'ayin', 'פא':'pe', 'צדי':'tsadi', 'קוף':'qof', 'ריש':'resh', 'שין':'shin', 'תו':'tav', 'כף סופית':'kaf-final', 'מם סופית':'mem-final', 'נון סופית':'nun-final', 'פא סופית':'pe-final', 'צדי סופית':'tsadi-final' };
export function speechClipId(text: string, locale: string): string | undefined {
  if (/^(?:0|[1-9]|1[0-9]|20)$/.test(text)) return `number.${locale === 'he' ? 'he' : 'en'}.${text}`;
  if (locale === 'he' && keyIds[text]) return `key.he.${keyIds[text]}`;
  if (locale === 'en' && /^[a-z]$/i.test(text)) return `key.en.${text.toLowerCase()}`;
  return undefined;
}
