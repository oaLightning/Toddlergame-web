#!/usr/bin/env node
/** Offline asset generation only. Never expose provider credentials to the browser. */
import { readFile, writeFile, mkdir, rename, stat, copyFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';

const defaultRoot=resolve(dirname(fileURLToPath(import.meta.url)),'..');
export const voices=[
 {name:'Sarah',voice:'EXAVITQu4vr4xnSDxMaL',model:'eleven_v3'},
 {name:'Jessica',voice:'cgSgspJ2msm6clMCkdW9',model:'eleven_v4'},
];
export function safeClipPath(id){
 if(typeof id!=='string'||!/^[a-zA-Z0-9_.-]+$/.test(id)||id.includes('..'))throw new Error('Unsafe audio clip ID');
 return `audio/${id}.elevenlabs.mp3`;
}
/** Group examples and all page instructions under the longest exact lesson prefix. */
export function voiceFor(id,lessonIds=[]){
 const sorted=[...lessonIds].sort((a,b)=>b.length-a.length);
 const group=sorted.find(lesson=>id===lesson||id.startsWith(`${lesson}-`)||id.startsWith(`${lesson}.`))??id;
 const hash=createHash('sha256').update(group).digest();
 return voices[hash[0]%voices.length];
}
/** Both selected models charge one credit per character. Reserve normalization headroom. */
export function estimatedCredits(text){
 if(typeof text!=='string'||!text.trim())throw new Error('Speech text must not be empty');
 return Math.ceil([...text].length*1.2)+16;
}
export function selectBudgeted(clips,{maxCredits=8000,limit=150}={}){
 if(!Number.isInteger(maxCredits)||maxCredits<1||maxCredits>9000)throw new Error('--max-credits must be an integer from 1 to 9000');
 if(!Number.isInteger(limit)||limit<0||limit>2000)throw new Error('--limit must be an integer from 0 to 2000');
 let estimated=0;const selected=[];
 for(const clip of clips){const cost=estimatedCredits(clip.text);if(selected.length>=limit||estimated+cost>maxCredits)break;selected.push(clip);estimated+=cost;}
 return {selected,estimated};
}
export function currentRecording(entry,clip){
 return entry?.status==='ready'&&entry.text===clip.text&&entry.lang===clip.lang&&typeof entry.src==='string'&&/^audio\/[a-zA-Z0-9_.-]+\.(wav|mp3)$/.test(entry.src)&&!entry.src.includes('..');
}
export function priority(clip){
 const id=clip.id;
 if(id.startsWith('feedback.'))return 0;
 if(id.startsWith('play.')||id==='game.freeze.win'||id==='audio.activation.he')return 1;
 if(/^(he-(alef|bet|gimel|dalet)|en-[satm])(?:[-.]|$)/.test(id))return id.includes('.example.')?4:2;
 if(/^numbers-(0-5|add|subtract)-/.test(id))return /-(story-[123]|count-[0-5]|trace-[0-5])$/.test(id)?3:5;
 if(/^(key\.|number\.)/.test(id))return 6;
 return 7;
}
export function requestBody(clip,voice){return {text:clip.text,model_id:voice.model,language_code:clip.lang,voice_settings:{stability:0.5,similarity_boost:0.75}};}
export function recordingFingerprint(clip,voice){return createHash('sha256').update(JSON.stringify({engine:'elevenlabs',...requestBody(clip,voice),voice:voice.voice})).digest('hex');}
async function atomicJson(path,value){await writeFile(`${path}.tmp`,JSON.stringify(value,null,2)+'\n');await rename(`${path}.tmp`,path);}
function mp3(bytes){return bytes.length>100&&(bytes.toString('ascii',0,3)==='ID3'||bytes[0]===255&&(bytes[1]&224)===224);}

export async function main(args=process.argv.slice(2),{root=defaultRoot,fetchImpl=fetch,lessonIds:providedLessonIds}={}){
 const value=(name,fallback)=>{const i=args.indexOf(name);if(i<0)return fallback;if(!args[i+1]||args[i+1].startsWith('--'))throw new Error(`Missing value for ${name}`);return args[i+1];};
 if(args.includes('--help')){console.log('node scripts/generate-elevenlabs.mjs [--dry-run] [--only PREFIX] [--limit N] [--max-credits N] [--delay-ms N]');return;}
 const maxCredits=Number(value('--max-credits','8000')),limit=Number(value('--limit','150')),delayMs=Number(value('--delay-ms','250'));
 selectBudgeted([],{maxCredits,limit});
 if(!Number.isInteger(delayMs)||delayMs<0||delayMs>60000)throw new Error('--delay-ms must be an integer from 0 to 60000');
 const publicRoot=resolve(root,'public'),audioRoot=resolve(publicRoot,'audio'),manifestPath=resolve(audioRoot,'manifest.json');
 const catalog=JSON.parse(await readFile(resolve(audioRoot,'catalog.json'),'utf8'));
 let manifest={};try{manifest=JSON.parse(await readFile(manifestPath,'utf8'));}catch(e){if(e.code!=='ENOENT')throw e;}
 const ids=new Set();for(const clip of catalog){safeClipPath(clip.id);if(ids.has(clip.id))throw new Error('Duplicate audio clip ID');ids.add(clip.id);estimatedCredits(clip.text);if(!['he','en'].includes(clip.lang))throw new Error('Unsupported speech language');}
 const prefix=value('--only','');let pending=[];
 for(const clip of catalog){
  if(!clip.id.startsWith(prefix))continue;
  if(currentRecording(manifest[clip.id],clip)){try{if((await stat(resolve(publicRoot,manifest[clip.id].src))).size>100)continue;}catch{/* Missing files can be regenerated. */}}
  pending.push(clip);
 }
 pending.sort((a,b)=>priority(a)-priority(b));
 const plan=selectBudgeted(pending,{maxCredits,limit});
 let lessonIds=providedLessonIds;
 if(!lessonIds){const {createServer}=await import('vite');const server=await createServer({root,configFile:false,optimizeDeps:{noDiscovery:true,include:[]},server:{middlewareMode:true},appType:'custom'});try{const {lessons}=await server.ssrLoadModule('/src/content/index.ts');lessonIds=lessons.map(l=>l.id);}finally{await server.close();}}
 console.log(`${pending.length} missing recordings; ${plan.selected.length} planned; conservative estimate ${plan.estimated}/${maxCredits} credits. Existing recordings from all providers remain valid.`);
 if(args.includes('--dry-run')||!plan.selected.length)return {planned:plan.selected.length,estimatedCredits:plan.estimated,generated:0,spent:0};
 const key=process.env.ELEVENLABS_API_KEY;if(!key)throw new Error('ELEVENLABS_API_KEY is not set. No requests made. Supply it only in the generation process environment.');
 let spent=0,generated=0,reused=0;
 const reuseCache=new Map();
 for(const [id,entry] of Object.entries(manifest)){
  if(entry?.engine!=='elevenlabs'||entry.status!=='ready'||typeof entry.src!=='string'||!/^audio\/[a-zA-Z0-9_.-]+\.mp3$/.test(entry.src)||entry.src.includes('..'))continue;
  if(!entry.text||!entry.lang||!entry.model||!entry.voice)continue;
  const hash=recordingFingerprint(entry,entry);if(hash!==entry.fingerprint)continue;
  try{const bytes=await readFile(resolve(publicRoot,entry.src));if(mp3(bytes))reuseCache.set(hash,{id,src:entry.src});}catch{/* Only valid existing files are reusable. */}
 }
 await mkdir(audioRoot,{recursive:true});
 for(const clip of plan.selected){
  const voice=voiceFor(clip.id,lessonIds),hash=recordingFingerprint(clip,voice);
  const cached=reuseCache.get(hash);
  if(cached){
   const src=safeClipPath(clip.id),path=resolve(publicRoot,src);
   await copyFile(resolve(publicRoot,cached.src),`${path}.tmp`);await rename(`${path}.tmp`,path);
   manifest[clip.id]={text:clip.text,lang:clip.lang,status:'ready',src,engine:'elevenlabs',model:voice.model,voice:voice.voice,voiceName:voice.name,fingerprint:hash,generatedAt:new Date().toISOString(),creditCost:0,creditCostEstimated:false,reusedFrom:cached.id};
   await atomicJson(manifestPath,manifest);reused++;
   console.log(`Reused ${clip.id} (${voice.name}; 0 new credits).`);continue;
  }
  const reserve=estimatedCredits(clip.text);if(spent+reserve>maxCredits)break;
  if(generated&&delayMs)await new Promise(r=>setTimeout(r,delayMs));
  const response=await fetchImpl(`https://api.elevenlabs.io/v1/text-to-speech/${voice.voice}?output_format=mp3_44100_128`,{method:'POST',headers:{'xi-api-key':key,'Content-Type':'application/json'},body:JSON.stringify(requestBody(clip,voice)),signal:AbortSignal.timeout(120000)});
  if(!response.ok)throw new Error(`ElevenLabs returned HTTP ${response.status}; stopped without retrying. Completed clips remain saved. Check quota or key permissions.`);
  const bytes=Buffer.from(await response.arrayBuffer());if(!mp3(bytes))throw new Error('ElevenLabs did not return a valid MP3 header; stopped.');
  const rawCost=response.headers.get('character-cost'),numericCost=rawCost===null?NaN:Number(rawCost);
  const knownCost=Number.isFinite(numericCost)&&numericCost>=0;
  const creditCost=knownCost?Math.ceil(numericCost):reserve;
  spent+=creditCost;
  const src=safeClipPath(clip.id),path=resolve(publicRoot,src);
  await writeFile(`${path}.tmp`,bytes);await rename(`${path}.tmp`,path);
  manifest[clip.id]={text:clip.text,lang:clip.lang,status:'ready',src,engine:'elevenlabs',model:voice.model,voice:voice.voice,voiceName:voice.name,fingerprint:recordingFingerprint(clip,voice),generatedAt:new Date().toISOString(),creditCost,creditCostEstimated:!knownCost};
  await atomicJson(manifestPath,manifest);generated++;reuseCache.set(hash,{id:clip.id,src});
  console.log(`Generated ${clip.id} (${voice.name}, ${creditCost} credits${knownCost?'':' estimated'}; ${spent}/${maxCredits} used).`);
  if(!knownCost)throw new Error('Credit-cost header was unavailable. The completed clip was saved; stopped rather than continuing with unknown spending.');
  if(spent>maxCredits)throw new Error('Provider charge exceeded the conservative estimate. Completed clip saved; generation stopped.');
 }
 console.log(`Saved ${generated} new recordings and reused ${reused}; ${spent} credits reported.`);
 return {generated,reused,spent,planned:plan.selected.length,estimatedCredits:plan.estimated};
}
if(process.argv[1]&&pathToFileURL(resolve(process.argv[1])).href===import.meta.url)main().catch(error=>{console.error(error.message);process.exitCode=1;});
