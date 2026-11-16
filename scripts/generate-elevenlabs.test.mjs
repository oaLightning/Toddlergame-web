import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {safeClipPath,voiceFor,estimatedCredits,selectBudgeted,currentRecording,priority,main} from './generate-elevenlabs.mjs';

test('ElevenLabs voices remain stable within a lesson while distinct lessons use both approved voices',()=>{
 const lessons=['he-alef','he-bet','he-gimel','he-dalet','en-s','en-a','numbers-0-5'];
 const used=new Set();for(const id of lessons){const a=voiceFor(`${id}-hello`,lessons),b=voiceFor(`${id}.${id}-words.example.0`,lessons);assert.deepEqual(a,b);used.add(a.name);}
 assert.deepEqual([...used].sort(),['Jessica','Sarah']);
});
test('ElevenLabs bounded planning rejects invalid limits and never plans above its conservative estimate',()=>{
 const clips=Array.from({length:100},(_,i)=>({id:`c${i}`,text:'שלום עולם'}));
 const plan=selectBudgeted(clips,{maxCredits:100,limit:90});assert(plan.estimated<=100);assert(plan.selected.length<100);
 assert(estimatedCredits('שלום עולם')>='שלום עולם'.length);
 assert.throws(()=>selectBudgeted(clips,{maxCredits:Infinity}));assert.throws(()=>selectBudgeted(clips,{maxCredits:10000}));assert.throws(()=>selectBudgeted(clips,{limit:-1}));
 assert.throws(()=>safeClipPath('../key'));assert.throws(()=>safeClipPath('id/escape'));assert.equal(safeClipPath('he-alef-hello'),'audio/he-alef-hello.elevenlabs.mp3');
});
test('ready recordings from other providers survive unless their text/language changes',()=>{
 const clip={id:'test',text:'שלום',lang:'he'};const ready={status:'ready',text:'שלום',lang:'he',src:'audio/test.wav',engine:'gemini',fingerprint:'other-provider'};
 assert(currentRecording(ready,clip));assert(!currentRecording(ready,{...clip,text:'היי'}));assert(!currentRecording({...ready,src:'audio/../secret.wav'},clip));
 assert(priority({id:'feedback.success.he'})<priority({id:'he-alef-trace'}));assert(priority({id:'play.freeze.instructions'})<priority({id:'number.he.20'}));assert(priority({id:'he-alef-trace'})<priority({id:'he-alef.he-alef-words.example.0'}));
});
test('successful generation persists one mixed-provider manifest and stops when billing metadata is unavailable',async()=>{
 const root=await mkdtemp(join(tmpdir(),'eleven-generation-'));const base=join(root,'public','audio');await mkdir(base,{recursive:true});
 const oldEnv=process.env.ELEVENLABS_API_KEY;process.env.ELEVENLABS_API_KEY='test-key';
 try{
  const catalog=[{id:'existing',text:'שלום',lang:'he'},{id:'feedback.success.he',text:'כל הכבוד',lang:'he'},{id:'later',text:'עוד',lang:'he'}];
  const existing={status:'ready',text:'שלום',lang:'he',src:'audio/existing.wav',engine:'gemini',fingerprint:'leave-me'};
  await writeFile(join(base,'existing.wav'),Buffer.alloc(101));await writeFile(join(base,'catalog.json'),JSON.stringify(catalog));await writeFile(join(base,'manifest.json'),JSON.stringify({existing}));
  let calls=0;
  await assert.rejects(()=>main(['--max-credits','100','--delay-ms','0'],{root,lessonIds:[],fetchImpl:async(url,options)=>{calls++;assert.equal(options.headers['xi-api-key'],'test-key');assert(!url.includes('test-key'));assert.equal(JSON.parse(options.body).language_code,'he');return new Response(Buffer.concat([Buffer.from('ID3'),Buffer.alloc(101)]),{status:200,headers:{'content-type':'audio/mpeg'}});}}),/billing|Credit-cost/);
  assert.equal(calls,1);const result=JSON.parse(await readFile(join(base,'manifest.json'),'utf8'));assert.deepEqual(result.existing,existing);assert.equal(result['feedback.success.he'].status,'ready');assert.equal(result['feedback.success.he'].engine,'elevenlabs');assert.equal(result['feedback.success.he'].creditCostEstimated,true);assert(!JSON.stringify(result).includes('test-key'));
 }finally{if(oldEnv===undefined)delete process.env.ELEVENLABS_API_KEY;else process.env.ELEVENLABS_API_KEY=oldEnv;await rm(root,{recursive:true,force:true});}
});

test('identical payloads in the same voice reuse a validated MP3 without another API charge',async()=>{
 const root=await mkdtemp(join(tmpdir(),'eleven-reuse-'));const base=join(root,'public','audio');await mkdir(base,{recursive:true});
 const oldEnv=process.env.ELEVENLABS_API_KEY;process.env.ELEVENLABS_API_KEY='test-key';
 try{
  const catalog=[{id:'he-alef-hello',text:'שלום עולם',lang:'he'},{id:'he-alef-trace',text:'שלום עולם',lang:'he'}];
  await writeFile(join(base,'catalog.json'),JSON.stringify(catalog));await writeFile(join(base,'manifest.json'),'{}');let calls=0;
  const result=await main(['--max-credits','100','--delay-ms','0'],{root,lessonIds:['he-alef'],fetchImpl:async()=>{calls++;return new Response(Buffer.concat([Buffer.from('ID3'),Buffer.alloc(101)]),{status:200,headers:{'content-type':'audio/mpeg','character-cost':'9'}});}});
  assert.equal(calls,1);assert.equal(result.spent,9);assert.equal(result.reused,1);
  const manifest=JSON.parse(await readFile(join(base,'manifest.json'),'utf8'));assert.equal(manifest['he-alef-trace'].reusedFrom,'he-alef-hello');assert.equal(manifest['he-alef-trace'].creditCost,0);
  assert.deepEqual(await readFile(join(base,'he-alef-hello.elevenlabs.mp3')),await readFile(join(base,'he-alef-trace.elevenlabs.mp3')));
 }finally{if(oldEnv===undefined)delete process.env.ELEVENLABS_API_KEY;else process.env.ELEVENLABS_API_KEY=oldEnv;await rm(root,{recursive:true,force:true});}
});
