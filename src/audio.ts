import { speechClipId } from './audio-policy';
import {chooseFeedback,successClips,retryClips} from './feedback';
let previousPraise:string|undefined,previousRetry:string|undefined;
let previousEffect='';
export const RECORDED_SPEECH_RATE=1.15;
export function feedbackSpeech(success:boolean,locale:string,enabled=true){
 const pool=success?successClips:retryClips.filter(clip=>clip.lang===locale);
 const clip=chooseFeedback(pool,success?previousPraise:previousRetry);
 if(success)previousPraise=clip.id;else previousRetry=clip.id;
 speak(clip.text,clip.lang,clip.id,enabled);
 return clip.text;
}
type Clip = { src?: string | null; file?: string; path?: string; status?: string };
export type AudioStatus = { activated: boolean; effects: string; speech: string; error: string };
let status: AudioStatus = { activated: false, effects: 'לא נבדק', speech: 'קול המכשיר', error: '' };
const subscribers = new Set<() => void>();
export const getAudioStatus = () => status;
export const subscribeAudio = (callback: () => void) => { subscribers.add(callback); return () => { subscribers.delete(callback); }; };
function update(next: Partial<AudioStatus>) { status = { ...status, ...next }; subscribers.forEach(callback => callback()); }
export const assetUrl = (path: string) => /^(https?:|data:|blob:)/.test(path) ? path : import.meta.env.BASE_URL + path.replace(/^\//, '');
let audioManifest: Record<string, string | Clip> = {};
let manifestLoaded = false;
const manifestReady = fetch(assetUrl('audio/manifest.json'), {cache:'no-store'}).then(r => r.ok ? r.json() : {}).then((data: Record<string, unknown>) => {
  audioManifest = (data.clips ?? data.entries ?? data) as Record<string, string | Clip>; manifestLoaded = true;
}).catch(() => update({ error: 'לא הצלחנו לטעון את רשימת ההקלטות. נסי לרענן.' }));

function playbackSession() {
  try { const session = (navigator as Navigator & { audioSession?: { type: string } }).audioSession; if (session) session.type = 'playback'; } catch { /* Optional WebKit API. */ }
}
function player(src?: string): HTMLAudioElement {
  const audio = new Audio(src ? assetUrl(src) : undefined);
  audio.preload = 'auto'; audio.setAttribute('playsinline', '');
  return audio;
}
let speechPlayer: HTMLAudioElement | null = null;
let utterance: SpeechSynthesisUtterance | null = null;
let speechRequest = 0;
const effectPools: Record<string, HTMLAudioElement[]> = {};
let effectIndex = 0;
export function stopSpeech() {
  speechRequest++; speechPlayer?.pause();
  window.speechSynthesis?.cancel(); utterance = null;
}
/** Call directly in a user click handler, not a React effect. */
export function enableAudio(): void {
  playbackSession(); update({ activated: true, error: '' });
  sound(true);
  speak('הקול מופעל. בואי נשחק!', 'he', 'audio.activation.he', true);
  const activation=audioManifest['audio.activation.he'];
  if(typeof activation==='string'||activation?.status==='ready')return;
  speechPlayer ??= player();
  speechPlayer.src = assetUrl('audio/effects/unlock.wav');
  const request = speechRequest;
  void speechPlayer.play().catch(error => {
    if (request === speechRequest && error?.name !== 'AbortError') update({ error: 'הדפדפן חסם את הקול. לחצי שוב על הפעלת קול.' });
  });
}
export function speak(text: string, locale: string, id?: string, enabled = true): void {
  stopSpeech(); if (!enabled) return;
  playbackSession(); const request = speechRequest;
  const clipId = id ?? speechClipId(text, locale) ?? '';
  const entry = audioManifest[clipId];
  if(!manifestLoaded)void manifestReady.then(()=>{const ready=audioManifest[clipId];if(request===speechRequest&&(typeof ready==='string'||ready?.status==='ready'))speak(text,locale,clipId,enabled);});
  const file = typeof entry === 'string' ? entry : entry?.status === 'pending' ? undefined : entry?.src ?? entry?.file ?? entry?.path;
  const fallback = () => {
    if (request !== speechRequest) return;
    if (!window.speechSynthesis) { update({ speech: 'אין קריינות זמינה', error: 'הדפדפן לא תומך בקריינות. הקלטות הקריינות עדיין ממתינות ליצירה.' }); return; }
    const voices = window.speechSynthesis.getVoices();
    const matching = voices.find(voice => voice.lang.toLowerCase().startsWith(locale === 'he' ? 'he' : 'en'));
    if (voices.length && !matching) { update({ speech: locale === 'he' ? 'אין קול עברי במכשיר' : 'אין קול אנגלי במכשיר', error: 'לא נמצא קול מתאים במכשיר. הקלטות הקריינות עדיין ממתינות ליצירה.' }); return; }
    utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = locale === 'he' ? 'he-IL' : 'en-US'; utterance.rate = .95;
    if (matching) utterance.voice = matching;
    utterance.onstart = () => { if (request === speechRequest) update({ speech: 'קול המכשיר פועל', activated: true }); };
    utterance.onerror = event => {
      if (request !== speechRequest || ['canceled', 'interrupted'].includes(event.error)) return;
      update({ speech: 'הקריינות לא התחילה', error: 'הקריינות נחסמה או לא זמינה. לחצי על הפעלת קול, ואז על לשמוע שוב.' });
    };
    window.speechSynthesis.speak(utterance);
  };
  if (file) {
    speechPlayer ??= player(); speechPlayer.src = assetUrl(file); speechPlayer.defaultPlaybackRate=RECORDED_SPEECH_RATE; speechPlayer.playbackRate=RECORDED_SPEECH_RATE; speechPlayer.preservesPitch=true; speechPlayer.onerror = fallback;
    void speechPlayer.play().then(() => { if (request === speechRequest) update({ activated: true, speech: 'הקלטה מוכנה פועלת', error: '' }); }).catch(fallback);
  } else fallback();
}
/** Bundled media clips are independent of Web Audio and device speech support. */
export function sound(success: boolean): void {
  playbackSession(); const choices=success?['success','sparkle','bubble','boing']:['bump'];const available=choices.filter(key=>key!==previousEffect);const key=available[Math.floor(Math.random()*available.length)]??choices[0];previousEffect=key;
  try {
    const pool = effectPools[key] ??= Array.from({ length: 3 }, () => player(`audio/effects/${key}.wav`));
    const audio = pool[effectIndex++ % pool.length];
    audio.pause(); audio.currentTime = 0; audio.volume = .8;
    void audio.play().then(() => update({ activated: true, effects: 'צלילי המשחק פועלים' })).catch(() => update({ effects: 'הצלילים נחסמו', error: 'לחצי על הפעלת קול ובדקי את עוצמת המדיה באייפון.' }));
  } catch { update({ effects: 'הצלילים לא זמינים', error: 'לא הצלחנו לנגן את הצליל. נסי לרענן ולהפעיל קול.' }); }
}
