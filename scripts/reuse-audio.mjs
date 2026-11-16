import {readFile,writeFile,rename,stat,copyFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {narrationKey,reusableSource,requestEstimate} from './audio-reuse.mjs';
export async function reuseAudio(root=resolve(dirname(fileURLToPath(import.meta.url)),'..')){
 const base=resolve(root,'public'),path=resolve(base,'audio/manifest.json');
 const catalog=JSON.parse(await readFile(resolve(base,'audio/catalog.json'),'utf8')),manifest=JSON.parse(await readFile(path,'utf8'));
 const cache=new Map();
 for(const clip of catalog){const entry=manifest[clip.id];if(!reusableSource(entry,clip))continue;try{if((await stat(resolve(base,entry.src))).size>100&&!cache.has(narrationKey(clip)))cache.set(narrationKey(clip),{id:clip.id,entry});}catch{/* Missing files are not reusable. */}}
 let reused=0;
 for(const clip of catalog){if(reusableSource(manifest[clip.id],clip))continue;const source=cache.get(narrationKey(clip));if(!source)continue;
  const suffix=source.entry.engine==='elevenlabs'?'.elevenlabs.mp3':'.wav';
  const src=`audio/${clip.id}${suffix}`;if(!/^[A-Za-z0-9_.-]+$/.test(clip.id)||clip.id.includes('..'))throw new Error('Unsafe clip ID');
  await copyFile(resolve(base,source.entry.src),resolve(base,src));
  manifest[clip.id]={...source.entry,text:clip.text,lang:clip.lang,src,reusedFrom:source.id,reusedAt:new Date().toISOString(),...(source.entry.engine==='elevenlabs'?{creditCost:0,creditCostEstimated:false}:{})};reused++;
 }
 await writeFile(path+'.tmp',JSON.stringify(manifest,null,2)+'\n');await rename(path+'.tmp',path);
 const result={reused,...requestEstimate(catalog,manifest)};console.log(JSON.stringify(result));return result;
}
if(process.argv[1]&&pathToFileURL(resolve(process.argv[1])).href===import.meta.url)reuseAudio().catch(e=>{console.error(e.message);process.exitCode=1;});
