type Clip = { src?: string | null; file?: string; path?: string; status?: string };
let audioManifest: Record<string, string | Clip> = {};
let active: HTMLAudioElement | null = null;
export const assetUrl = (path: string) => /^(https?:|data:|blob:)/.test(path) ? path : import.meta.env.BASE_URL + path.replace(/^\//, '');
fetch(assetUrl('audio/manifest.json')).then(r=>r.ok?r.json():{}).then((data: Record<string, unknown>)=>{audioManifest = (data.clips ?? data.entries ?? data) as Record<string,string|Clip>;}).catch(()=>{});
export function stopSpeech() { active?.pause(); active = null; window.speechSynthesis?.cancel(); }
export function speak(text: string, locale: string, id?: string, enabled = true) {
  stopSpeech(); if(!enabled) return;
  const entry = id ? audioManifest[id] : undefined;
  const file = typeof entry === 'string' ? entry : entry?.status === 'pending' ? undefined : entry?.src ?? entry?.file ?? entry?.path;
  const fallback = () => { if(!window.speechSynthesis) return; const utterance = new SpeechSynthesisUtterance(text); utterance.lang = locale === 'he' ? 'he-IL' : 'en-US'; utterance.rate = .8; window.speechSynthesis.speak(utterance); };
  if(file) { active = new Audio(assetUrl(file)); active.onerror = fallback; active.play().catch(fallback); } else fallback();
}
let context: AudioContext | null = null;
export function sound(success: boolean) { try { context ??= new AudioContext(); void context.resume(); const now=context.currentTime; const oscillator=context.createOscillator(); const volume=context.createGain(); oscillator.connect(volume); volume.connect(context.destination); oscillator.type='sine'; oscillator.frequency.setValueAtTime(success?523:180,now); oscillator.frequency.exponentialRampToValueAtTime(success?784:140,now+.15); volume.gain.setValueAtTime(.08,now); volume.gain.exponentialRampToValueAtTime(.001,now+.25); oscillator.start(); oscillator.stop(now+.26); } catch { /* Audio remains optional. */ } }
