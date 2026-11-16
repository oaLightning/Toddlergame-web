/** Exact spoken text only: never normalize vowel marks, case, punctuation or language. */
export function narrationKey(clip){
 const id=clip.id??'';
 const role=id.startsWith('feedback.')?id:id.startsWith('key.')?'letter-name':id.startsWith('number.')?'number-name':id.includes('.example.')?'word':'instruction';
 return JSON.stringify([clip.lang,clip.text,role]);
}
export function reusableSource(entry,clip){
 return entry?.status==='ready'&&entry.text===clip.text&&entry.lang===clip.lang&&typeof entry.src==='string'&&/^audio\/[A-Za-z0-9_.-]+\.(?:wav|mp3)$/.test(entry.src)&&!entry.src.includes('..');
}
export function requestEstimate(catalog,manifest){
 const readyKeys=new Set(catalog.filter(c=>reusableSource(manifest[c.id],c)).map(narrationKey));
 const pending=catalog.filter(c=>!reusableSource(manifest[c.id],c));
 return {pendingEntries:pending.length,reusableNow:pending.filter(c=>readyKeys.has(narrationKey(c))).length,newRequests:new Set(pending.filter(c=>!readyKeys.has(narrationKey(c))).map(narrationKey)).size};
}
