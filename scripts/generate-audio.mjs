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
  add('feedback.success.he', 'כל הכבוד! הצלחת!', 'he');
  add('feedback.retry.he', 'בואי ננסה שוב, לאט לאט.', 'he');
  add('feedback.success.en', 'Well done! You did it!', 'en');
  add('feedback.retry.en', 'Let’s try again, slowly.', 'en');
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
async function atomicJson(path, value) { await writeFile(`${path}.tmp`, JSON.stringify(value, null, 2) + '\n'); await rename(`${path}.tmp`, path); }

export async function main(args = process.argv.slice(2)) {
  const value = (flag, fallback) => { const i=args.indexOf(flag); return i>=0 ? args[i+1] : fallback; };
  if (args.includes('--help')) {
    console.log('node scripts/generate-audio.mjs [--catalog-only] [--check] [--only ID_PREFIX] [--limit N] [--force] [--engine realtime|speech] [--model MODEL] [--voice VOICE]'); return;
  }
  const engine=value('--engine','speech');
  if (!['realtime','speech'].includes(engine)) throw new Error('Engine must be realtime or speech');
  const options={engine,model:value('--model',process.env.OPENAI_TTS_MODEL ?? (engine==='realtime'?'gpt-realtime-2.1-mini':'gpt-4o-mini-tts')),voice:value('--voice',process.env.OPENAI_TTS_VOICE ?? 'marin')};
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
  const key=process.env.OPENAI_API_KEY;
  if(!key) throw new Error('OPENAI_API_KEY is not set. Catalog saved; recordings remain pending. Set the key only in your local environment, then rerun.');
  for(const clip of pending) {
    const bytes=await (engine==='realtime'?realtime:speech)(clip,options,key);
    const path=resolve(root,'public',clipPath(clip.id));
    await writeFile(`${path}.tmp`,bytes); await rename(`${path}.tmp`,path);
    current[clip.id]={...current[clip.id],status:'ready',src:clipPath(clip.id),generatedAt:new Date().toISOString()};
    await atomicJson(manifestPath,current);
    console.log(`Generated ${clip.id}`);
  }
}
if(process.argv[1] && pathToFileURL(resolve(process.argv[1])).href===import.meta.url) main().catch(error=>{ console.error(error.message); process.exitCode=1; });
