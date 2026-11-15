export type KeyboardLocale = 'he' | 'en' | 'numbers';
export interface KeyboardKey { value: string; code: string; }
const hebrewPhysical: Record<string,string> = {
  KeyE:'ק',KeyR:'ר',KeyT:'א',KeyY:'ט',KeyU:'ו',KeyI:'ן',KeyO:'ם',KeyP:'פ',
  KeyA:'ש',KeyS:'ד',KeyD:'ג',KeyF:'כ',KeyG:'ע',KeyH:'י',KeyJ:'ח',KeyK:'ל',KeyL:'ך',Semicolon:'ף',
  KeyZ:'ז',KeyX:'ס',KeyC:'ב',KeyV:'ה',KeyB:'נ',KeyN:'מ',KeyM:'צ',Comma:'ת',Period:'ץ',
};
export const defaultTargets: Record<KeyboardLocale,string[]> = {he:['א','ב','ג','ד'],en:['s','a','t','m'],numbers:['1','2','3','4','5','6','7','8','9','0']};
export const keyNames: Record<string,string> = {'א':'אלף','ב':'בית','ג':'גימל','ד':'דלת','ה':'הא','ו':'וו','ז':'זין','ח':'חית','ט':'טית','י':'יוד','כ':'כף','ל':'למד','מ':'מם','נ':'נון','ס':'סמך','ע':'עין','פ':'פא','צ':'צדי','ק':'קוף','ר':'ריש','ש':'שין','ת':'תו','ך':'כף סופית','ם':'מם סופית','ן':'נון סופית','ף':'פא סופית','ץ':'צדי סופית',...Object.fromEntries([...'abcdefghijklmnopqrstuvwxyz'].map(letter=>[letter,letter.toUpperCase()])), '0':'אפס','1':'אחת','2':'שתיים','3':'שלוש','4':'ארבע','5':'חמש','6':'שש','7':'שבע','8':'שמונה','9':'תשע'};
export function spokenKey(key:string):string { return keyNames[key] ?? key; }
export function keyboardValue(key:string,code:string,locale:KeyboardLocale):string|null {
  if(locale==='numbers')return /^\d$/.test(key)?key:/^(Digit|Numpad)[0-9]$/.test(code)?code.slice(-1):null;
  if(locale==='he')return /^[א-ת]$/.test(key)?key:hebrewPhysical[code] ?? null;
  return /^[a-z]$/i.test(key)?key.toLowerCase():/^Key[A-Z]$/.test(code)?code.slice(3).toLowerCase():null;
}
export function keyboardRows(locale:KeyboardLocale):KeyboardKey[][] {
  if(locale==='numbers')return ['1234567890'].map(row=>[...row].map(value=>({value,code:`Digit${value}`})));
  const rows=['qwertyuiop','asdfghjkl;','zxcvbnm,.'];
  return rows.map(row=>[...row].map(value=>{const code=value===';'?'Semicolon':value===','?'Comma':value==='.'?'Period':`Key${value.toUpperCase()}`;return {value:locale==='he'?hebrewPhysical[code]??'':value,code};}));
}
export function defaultSequences(targets:string[]):string[] {
  if(!targets.length)return [];
  return [targets.slice(0,2).join(''),[targets[1%targets.length],targets[0],targets[2%targets.length]].join(''),[targets[0],targets[2%targets.length],targets[1%targets.length],targets[3%targets.length]].join('')];
}
