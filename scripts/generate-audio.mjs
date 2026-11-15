#!/usr/bin/env node
/** Build-time only. Credentials never enter the browser bundle or manifest. */
import { readFile, writeFile, mkdir, stat, rename } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const audioDir = resolve(root, 'public/audio');
const manifestPath = resolve(audioDir, 'manifest.json');
const delivery = 'You are a friendly, calm preschool narrator, never a fictional character. Speak slowly and clearly, with natural Israeli Hebrew for Hebrew text and clear English for English text. Address the child as female in Hebrew. Read only the supplied text exactly; do not add explanations or greetings. Preserve the distinction between a letter name and its sound. Do not turn isolated consonant sounds into letter names.';

export function fingerprint(clip, options) {
  return createHash('sha256').update(JSON.stringify({text: clip.text, lang: clip.lang, delivery, ...options})).digest('hex');
}
export function clipPath(id) {
  if (!/^[a-zA-Z0-9_.-]+$/.test(id) || id.includes('..')) throw new Error(`Unsafe audio id: ${id}`);
  return `audio/${id}.wav`;
}
export function wav(pcm) {
  if (!pcm.length || pcm.length % 2) throw new Error('Expected nonempty 16-bit mono PCM');
  const h = Buffer.alloc(44);
  h.write('RIFF'); h.writeUInt32LE(pcm.length + 36, 4); h.write('WAVEfmt ', 8);
  h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22);
  h.writeUInt32LE(24000, 24); h.writeUInt32LE(48000, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34);
  h.write('data', 36); h.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([h, pcm]);
}
export function narrationLang(text, fallback = 'he') {
  if (/[\u0590-\u05ff]/u.test(text)) return 'he';
  if (/[a-z]/iu.test(text)) return 'en';
  return fallback;
}
export function collectCatalog(lessons) {
  const clips = new Map();
  const add = (id, text, lang) => {
    clipPath(id);
    if (typeof text !== 'string' || !text.trim()) throw new Error(`Empty text for ${id}`);
    const previous = clips.get(id);
    if (previous && (previous.text !== text || previous.lang !== lang)) throw new Error(`Conflicting audio id ${id}`);
    clips.set(id, {id, text, lang});
  };
  add('audio.activation.he', 'הקול מופעל. בואי נשחק!', 'he');
  add('feedback.success.he', 'כל הכבוד! הצלחת!', 'he');
  add('feedback.retry.he', 'בואי ננסה שוב, לאט לאט.', 'he');
  add('feedback.success.en', 'Well done! You did it!', 'en');
  add('feedback.retry.en', 'Let’s try again, slowly.', 'en');
  add('game.freeze.win', 'איזה קסם! הכול קפוא. הצלחת!', 'he');
  const hebrewNumbers = ['אפס', 'אחת', 'שתיים', 'שלוש', 'ארבע', 'חמש', 'שש', 'שבע', 'שמונה', 'תשע', 'עשר', 'אחת עשרה', 'שתים עשרה', 'שלוש עשרה', 'ארבע עשרה', 'חמש עשרה', 'שש עשרה', 'שבע עשרה', 'שמונה עשרה', 'תשע עשרה', 'עשרים'];
  const englishNumbers = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
  hebrewNumbers.forEach((word,n) => add(`number.he.${n}`, word, 'he'));
  englishNumbers.forEach((word,n) => add(`number.en.${n}`, word, 'en'));
  for (const [id,name] of Object.entries({alef:'אָלֶף',bet:'בֵּית',gimel:'גִּימֶל',dalet:'דָּלֶת',he:'הֵא',vav:'וָו',zayin:'זַיִן',het:'חֵית',tet:'טֵית',yod:'יוֹד',kaf:'כַּף',lamed:'לָמֶד',mem:'מֵם',nun:'נוּן',samekh:'סָמֶךְ',ayin:'עַיִן',pe:'פֵּא',tsadi:'צָדִי',qof:'קוּף',resh:'רֵישׁ',shin:'שִׁין',tav:'תָּו','kaf-final':'כַּף סוֹפִית','mem-final':'מֵם סוֹפִית','nun-final':'נוּן סוֹפִית','pe-final':'פֵּא סוֹפִית','tsadi-final':'צָדִי סוֹפִית'})) add(`key.he.${id}`,name,'he');
  for (const letter of 'abcdefghijklmnopqrstuvwxyz') add(`key.en.${letter}`,letter.toUpperCase(),'en');
  for (const lesson of lessons) for (const page of lesson.pages) {
    const id = page.audioId ?? `${lesson.id}.${page.id}`;
    const spoken = page.speech ?? page.instruction;
    add(id, spoken, narrationLang(spoken, lesson.locale));
    page.examples?.forEach((example, i) => {
      const word = example.speech ?? example.word;
      add(`${lesson.id}.${page.id}.example.${i}`, word, narrationLang(word, lesson.locale));
    });
  }
  return [...clips.values()];
}

async function realtime(clip, options, key) {
  const { default: WebSocket } = await import('ws');
  return new Promise((accept, reject) => {
    const socket = new WebSocket(`wss://api.openai.com/v1/realtime?model=${encodeURIComponent(options.model)}`, {headers: {Authorization: `Bearer ${key}`}});
    const chunks = [];
    let settled = false;
    const finish = (err, result) => { if (settled) return; settled = true; clearTimeout(timer); socket.close(); err ? reject(err) : accept(result); };
    const timer = setTimeout(() => finish(new Error('Audio generation timed out')), 120000);
    socket.on('error', () => finish(new Error('Realtime connection failed; check network and API access')));
    socket.on('close', () => { if (!settled) finish(new Error('Realtime connection closed before completing audio')); });
    socket.on('open', () => socket.send(JSON.stringify({type:'session.update', session:{type:'realtime', output_modalities:['audio'], audio:{output:{voice: options.voice, format:{type:'audio/pcm',rate:24000}}}}})));
    socket.on('message', raw => {
      let event;
      try { event = JSON.parse(raw.toString()); } catch { return finish(new Error('Invalid Realtime response')); }
      if (event.type === 'session.updated') socket.send(JSON.stringify({type:'response.create', response:{output_modalities:['audio'], input:[], instructions:`${delivery}\nLanguage: ${clip.lang === 'he' ? 'Hebrew (Israel)' : 'English'}.\nSay exactly this text:\n${clip.text}`}}));
      if (event.type === 'response.output_audio.delta') chunks.push(Buffer.from(event.delta, 'base64'));
      if (event.type === 'error') finish(new Error(`OpenAI Realtime error (${event.error?.code ?? 'unknown'}); no credential details logged`));
      if (event.type === 'response.done') {
        if (event.response?.status !== 'completed') return finish(new Error(`Generation did not complete (${event.response?.status})`));
        try { finish(null, wav(Buffer.concat(chunks))); } catch (err) { finish(err); }
      }
    });
  });
}
async function speech(clip, options, key) {
  const response = await fetch('https://api.openai.com/v1/audio/speech', {method:'POST', headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'}, body:JSON.stringify({model:options.model,voice:options.voice,input:clip.text,instructions:delivery,response_format:'wav',speed:0.9}),signal:AbortSignal.timeout(120000)});
  if (!response.ok) throw new Error(`OpenAI Speech API returned HTTP ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.toString('ascii',0,4) !== 'RIFF' || bytes.length < 100) throw new Error('OpenAI did not return a WAV file');
  return bytes;
}
export function geminiRequest(clip, options) {
  const modern = /^gemini-3\.8/.test(options.model);
  const part = modern
    ? {text:clip.text,speech_metadata:{style:`${delivery} Language: ${clip.lang === 'he' ? 'Hebrew (Israel)' : 'English'}.`}}
    : {text:`Synthesize speech. ${delivery}\nLanguage: ${clip.lang === 'he' ? 'Hebrew (Israel)' : 'English'}.\nRead only the transcript between the following markers, not the markers or these directions.\nTRANSCRIPT START\n${clip.text}\nTRANSCRIPT END`};
  return {
    contents:[{role:'user',parts:[part]}],
    generationConfig:{responseModalities:['AUDIO'],speechConfig:{voiceConfig:modern?{voice:options.voice}:{prebuiltVoiceConfig:{voiceName:options.voice}}}},
  };
}
export function geminiWav(response) {
  const parts=response?.candidates?.[0]?.content?.parts ?? [];
  const inline=parts.find(part=>part.inlineData?.data)?.inlineData;
  if(!inline){const error=new Error('Gemini did not return inline audio. No recording was saved.');error.code='GEMINI_NO_AUDIO';throw error;}
  const bytes=Buffer.from(inline.data,'base64');
  if(bytes.toString('ascii',0,4)==='RIFF' && bytes.toString('ascii',8,12)==='WAVE')return bytes;
  if(!/^audio\/(?:L16|pcm)/i.test(inline.mimeType ?? ''))throw new Error('Gemini returned an unsupported audio format.');
  const rate=/rate=(\d+)/i.exec(inline.mimeType ?? '');
  if(rate && Number(rate[1])!==24000)throw new Error('Gemini returned an unsupported PCM sample rate.');
  return wav(bytes);
}
export function geminiAudioMetadata(body) {
  const finish=body?.candidates?.[0]?.finishReason;
  const block=body?.promptFeedback?.blockReason;
  const finishReasons=['STOP','MAX_TOKENS','SAFETY','RECITATION','OTHER','BLOCKLIST','PROHIBITED_CONTENT','SPII','MALFORMED_FUNCTION_CALL','IMAGE_SAFETY','NO_IMAGE','UNEXPECTED_TOOL_CALL','TOO_MANY_TOOL_CALLS'];
  const blockReasons=['SAFETY','OTHER','BLOCKLIST','PROHIBITED_CONTENT','IMAGE_SAFETY'];
  return {
    finishReason:finishReasons.includes(finish)?finish:finish?'UNKNOWN':'ABSENT',
    blockReason:blockReasons.includes(block)?block:block?'UNKNOWN':'ABSENT',
    blocked:!!block||['SAFETY','RECITATION','BLOCKLIST','PROHIBITED_CONTENT','SPII','IMAGE_SAFETY'].includes(finish),
  };
}
export function canContinueAudioBatch(error) { return error?.code==='GEMINI_NO_AUDIO'; }
export function geminiQuotaExhausted(body) {
  const details=body?.error?.details ?? [];
  const violations=details.flatMap(detail=>Array.isArray(detail.violations)?detail.violations:[]);
  if(violations.some(violation=>{
    const value=violation.quotaValue ?? violation.quota_value ?? violation.limit;
    const id=`${violation.quotaId ?? violation.quota_id ?? ''} ${violation.quotaMetric ?? violation.quota_metric ?? ''}`;
    return value===0 || value==='0' || /perday|per_day|\/day|daily/i.test(id);
  }))return true;
  // Inspect provider text only for this decision; never include it in logs/errors.
  const message=typeof body?.error?.message==='string'?body.error.message:'';
  return /\blimit\s*[:=]\s*0\b|perday|per_day|\bdaily\b/i.test(message);
}
export function geminiRetryDelayMs(status, headers, body, attempt=0, now=Date.now()) {
  if(![429,500,503].includes(status) || geminiQuotaExhausted(body))return null;
  const raw=typeof headers?.get==='function'?headers.get('retry-after'):Object.entries(headers ?? {}).find(([name])=>name.toLowerCase()==='retry-after')?.[1];
  let headerMs=null;
  if(typeof raw==='string' && raw.trim()) {
    const seconds=Number(raw);
    headerMs=Number.isFinite(seconds)?Math.max(0,seconds*1000):Math.max(0,Date.parse(raw)-now);
  }
  const details=body?.error?.details ?? [];
  const retryInfo=details.find(detail=>String(detail['@type'] ?? '').endsWith('google.rpc.RetryInfo'));
  const delay=retryInfo?.retryDelay ?? retryInfo?.retry_delay;
  let infoMs=null;
  if(typeof delay==='string' && /^\d+(?:\.\d+)?s$/.test(delay))infoMs=Number(delay.slice(0,-1))*1000;
  else if(delay && typeof delay==='object') {
    const seconds=Number(delay.seconds ?? 0), nanos=Number(delay.nanos ?? 0);
    if(Number.isFinite(seconds)&&Number.isFinite(nanos))infoMs=seconds*1000+nanos/1e6;
  }
  const provided=[headerMs,infoMs].filter(value=>Number.isFinite(value)&&value!==null);
  const wait=provided.length?Math.max(...provided):1000*2**Math.max(0,Math.min(5,attempt));
  return Math.round(Math.max(100,Math.min(60000,wait)));
}
export async function gemini(clip, options, key, io={}) {
  const endpoint=`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(options.model)}:generateContent`;
  const request=io.fetch ?? fetch, sleep=io.sleep ?? (ms=>new Promise(resolve=>setTimeout(resolve,ms))), log=io.log ?? console.log;
  let noAudioAttempts=0;
  for(let attempt=0;attempt<6;attempt++) {
    const response=await request(endpoint,{method:'POST',headers:{'x-goog-api-key':key,'Content-Type':'application/json'},body:JSON.stringify(geminiRequest(clip,options)),signal:AbortSignal.timeout(120000)});
    if(response.ok) {
      const body=await response.json();
      try { return geminiWav(body); } catch(error) {
        if(error.code!=='GEMINI_NO_AUDIO')throw error;
        const metadata=geminiAudioMetadata(body);
        log(`Gemini TTS no audio; finishReason=${metadata.finishReason}; blockReason=${metadata.blockReason}.`);
        if(metadata.blocked){const blocked=new Error('Gemini TTS explicitly blocked this clip. Generation stopped; no provider payload logged.');blocked.code='GEMINI_BLOCKED';throw blocked;}
        noAudioAttempts++;
        if(noAudioAttempts>=3||attempt===5)throw error;
        const delayMs=1000*noAudioAttempts;
        log(`Gemini TTS retrying missing audio in ${delayMs/1000}s (audio attempt ${noAudioAttempts+1}/3).`);
        await sleep(delayMs);
        continue;
      }
    }
    let errorBody;
    try { errorBody=await response.json(); } catch { /* A non-JSON provider error has no safe retry metadata. */ }
    const delayMs=geminiRetryDelayMs(response.status,response.headers,errorBody,attempt);
    if(delayMs===null || attempt===5) {
      const reason=geminiQuotaExhausted(errorBody)?'daily or zero quota exhausted':attempt===5?'retry limit reached':'request rejected';
      throw new Error(`Gemini TTS returned HTTP ${response.status}; ${reason}. Completed recordings remain saved.`);
    }
    log(`Gemini TTS HTTP ${response.status}; retrying in ${delayMs/1000}s (attempt ${attempt+2}/6).`);
    await sleep(delayMs);
  }
}
async function atomicJson(path, value) { await writeFile(`${path}.tmp`, JSON.stringify(value, null, 2) + '\n'); await rename(`${path}.tmp`, path); }

export async function main(args = process.argv.slice(2)) {
  const value = (flag, fallback) => { const i=args.indexOf(flag); return i>=0 ? args[i+1] : fallback; };
  if (args.includes('--help')) {
    console.log('node scripts/generate-audio.mjs [--catalog-only] [--check] [--only ID_PREFIX] [--limit N] [--force] [--engine realtime|speech|gemini] [--model MODEL] [--voice VOICE] [--delay-ms N]'); return;
  }
  const engine=value('--engine','gemini');
  if (!['realtime','speech','gemini'].includes(engine)) throw new Error('Engine must be realtime, speech or gemini');
  const model=engine==='gemini'?(process.env.GEMINI_TTS_MODEL ?? 'gemini-2.5-flash-preview-tts'):(process.env.OPENAI_TTS_MODEL ?? (engine==='realtime'?'gpt-realtime-2.1-mini':'gpt-4o-mini-tts'));
  const voice=engine==='gemini'?(process.env.GEMINI_TTS_VOICE ?? 'Kore'):(process.env.OPENAI_TTS_VOICE ?? 'marin');
  const options={engine,model:value('--model',model),voice:value('--voice',voice)};
  const delayMs=Number(value('--delay-ms','0'));
  if(!Number.isInteger(delayMs)||delayMs<0)throw new Error('--delay-ms must be a nonnegative integer');
  const {createServer}=await import('vite');
  const server=await createServer({root,configFile:false,optimizeDeps:{noDiscovery:true,include:[]},server:{middlewareMode:true},appType:'custom'});
  let lessons;
  try { ({lessons}=await server.ssrLoadModule('/src/content/index.ts')); } finally { await server.close(); }
  const catalog=collectCatalog(lessons);
  await mkdir(audioDir,{recursive:true});
  let manifest={};
  try { manifest=JSON.parse(await readFile(manifestPath,'utf8')); } catch (err) { if(err.code!=='ENOENT') throw err; }
  const current={};
  for (const clip of catalog) {
    const hash=fingerprint(clip,options), previous=manifest[clip.id];
    let ready=false;
    if (previous?.fingerprint===hash && previous.status==='ready' && previous.src===clipPath(clip.id)) {
      try { ready=(await stat(resolve(root,'public',previous.src))).size>100; } catch { /* missing */ }
    }
    current[clip.id]=ready ? previous : {text:clip.text,lang:clip.lang,status:'pending',src:null,fingerprint:hash,...options};
  }
  if (!args.includes('--check')) {
    await atomicJson(resolve(audioDir,'catalog.json'),catalog);
    await atomicJson(manifestPath,current);
  }
  const prefix=value('--only','');
  const limit=Number(value('--limit',String(catalog.length)));
  if (!Number.isInteger(limit)||limit<0) throw new Error('--limit must be a nonnegative integer');
  const pending=catalog.filter(c=>c.id.startsWith(prefix)&&(args.includes('--force')||current[c.id].status!=='ready')).slice(0,limit);
  console.log(`${catalog.length} catalog clips; ${Object.values(current).filter(c=>c.status==='ready').length} ready; ${pending.length} selected for generation.`);
  if(args.includes('--check')) { if(Object.values(current).some(c=>c.status!=='ready')) process.exitCode=1; return; }
  if(args.includes('--catalog-only')||!pending.length) return;
  const keyName=engine==='gemini'?'GEMINI_API_KEY':'OPENAI_API_KEY';
  const key=process.env[keyName];
  if(!key) throw new Error(`${keyName} is not set. Catalog saved; recordings remain pending. Set the key only in your local environment, then rerun.`);
  let generated=0;
  const noAudioFailures=[];
  for(const clip of pending) {
    if(generated && delayMs)await new Promise(resolve=>setTimeout(resolve,delayMs));
    let bytes;
    try { bytes=await (engine==='gemini'?gemini:engine==='realtime'?realtime:speech)(clip,options,key); }
    catch(error) {
      if(!canContinueAudioBatch(error))throw error;
      noAudioFailures.push(clip.id);
      console.log(`Skipped ${clip.id}: no audio after bounded retries; recording remains pending.`);
      continue;
    }
    const path=resolve(root,'public',clipPath(clip.id));
    await writeFile(`${path}.tmp`,bytes); await rename(`${path}.tmp`,path);
    current[clip.id]={...current[clip.id],status:'ready',src:clipPath(clip.id),generatedAt:new Date().toISOString()};
    await atomicJson(manifestPath,current);
    console.log(`Generated ${clip.id}`);
    generated++;
  }
  if(noAudioFailures.length)throw new Error(`Generation completed with ${noAudioFailures.length} missing-audio clip(s). Successful recordings were saved; rerun to retry pending clips.`);
}
if(process.argv[1] && pathToFileURL(resolve(process.argv[1])).href===import.meta.url) main().catch(error=>{ console.error(error.message); process.exitCode=1; });
