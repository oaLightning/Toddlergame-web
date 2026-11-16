import test from 'node:test';
import assert from 'node:assert/strict';
import { fingerprint, clipPath, wav, collectCatalog, narrationLang, geminiRequest, geminiWav, geminiQuotaExhausted, geminiRetryDelayMs, geminiAudioMetadata, canContinueAudioBatch, gemini } from './generate-audio.mjs';

test('catalog uses exact app IDs and pronunciation text', () => {
  const clips=collectCatalog([{id:'he-aleph',locale:'he',pages:[{id:'intro',instruction:'Look',speech:'אָלֶף',examples:[{word:'אסיה'}]},{id:'find',audioId:'shared.find',instruction:'Find'}]}]);
  assert.equal(clips.find(c=>c.id==='he-aleph.intro').text,'אָלֶף');
  assert.equal(clips.find(c=>c.id==='he-aleph.intro.example.0').text,'אסיה');
  assert.equal(clips.find(c=>c.id==='shared.find').text,'Find');
  assert.equal(clips.find(c=>c.id==='feedback.retry.he').lang,'he');
});
test('conflicting IDs and filesystem escapes are rejected', () => {
  assert.throws(()=>clipPath('../oops'));
  assert.throws(()=>collectCatalog([{id:'one',locale:'he',pages:[{id:'a',audioId:'same',instruction:'א'},{id:'b',audioId:'same',instruction:'ב'}]}]),/Conflicting/);
});
test('voice, model, language and text changes invalidate recordings',()=>{
  const clip={text:'אָלֶף',lang:'he'};
  const options={model:'model',voice:'marin'};
  const hash=fingerprint(clip,options);
  assert.equal(hash,fingerprint({...clip},options));
  assert.notEqual(hash,fingerprint({...clip,text:'בֵּית'},options));
  assert.notEqual(hash,fingerprint(clip,{...options,voice:'cedar'}));
});
test('Realtime PCM is wrapped as 24kHz mono WAV',()=>{
  const bytes=wav(Buffer.alloc(480));
  assert.equal(bytes.toString('ascii',0,4),'RIFF');
  assert.equal(bytes.readUInt32LE(24),24000);
  assert.equal(bytes.readUInt32LE(40),480);
  assert.equal(bytes.length,524);
  assert.throws(()=>wav(Buffer.alloc(1)));
});
test('Hebrew directions in English lessons use Hebrew narration',()=>{
  assert.equal(narrationLang('מצאי את האות A','en'),'he');
  assert.equal(narrationLang('Apple','he'),'en');
  assert.equal(narrationLang('3','he'),'he');
  const clips=collectCatalog([{id:'english-a',locale:'en',pages:[{id:'intro',instruction:'מצאי את האות A'}]}]);
  assert.equal(clips.find(c=>c.id==='english-a.intro').lang,'he');
});
test('runtime game, number and key-name prompts have shared recordings',()=>{
  const clips=collectCatalog([]);
  assert.equal(clips.find(c=>c.id==='game.freeze.win').text,'איזה קסם! הכול קפוא. הצלחת!');
  for(let n=0;n<=20;n++) {
    assert.equal(clips.find(c=>c.id===`number.he.${n}`).lang,'he');
    assert.equal(clips.find(c=>c.id===`number.en.${n}`).lang,'en');
  }
  assert.equal(clips.find(c=>c.id==='key.he.alef').text,'אָלֶף');
  assert.equal(clips.find(c=>c.id==='key.en.a').text,'A');
  assert.equal(new Set(clips.map(c=>c.id)).size,clips.length);
});
test('Gemini 2.5 uses audio-only GenerateContent and a named prebuilt voice',()=>{
  const request=geminiRequest({text:'שלום אסיה',lang:'he'},{model:'gemini-2.5-flash-preview-tts',voice:'Kore'});
  assert.deepEqual(request.generationConfig.responseModalities,['AUDIO']);
  assert.equal(request.generationConfig.speechConfig.voiceConfig.prebuiltVoiceConfig.voiceName,'Kore');
  assert.match(request.contents[0].parts[0].text,/Hebrew \(Israel\)/);
  assert.match(request.contents[0].parts[0].text,/TRANSCRIPT START\nשלום אסיה\nTRANSCRIPT END/);
  assert.equal(JSON.stringify(request).includes('api-key'),false);
});
test('Gemini raw PCM gets a WAV header; existing WAV is preserved; missing or wrong-rate audio rejected',()=>{
  const pcm=Buffer.alloc(480);
  const response=data=>({candidates:[{content:{parts:[{inlineData:{mimeType:'audio/L16;codec=pcm;rate=24000',data:data.toString('base64')}}]}}]});
  const result=geminiWav(response(pcm));
  assert.equal(result.readUInt32LE(24),24000);
  assert.equal(result.length,524);
  assert.deepEqual(geminiWav(response(result)),result);
  assert.throws(()=>geminiWav({candidates:[]}),/did not return inline audio/);
  const wrong=response(pcm);wrong.candidates[0].content.parts[0].inlineData.mimeType='audio/L16;rate=16000';
  assert.throws(()=>geminiWav(wrong),/sample rate/);
});
test('Gemini 3.8 separates transcript metadata and uses modern voice configuration',()=>{
  const request=geminiRequest({text:'Hello',lang:'en'},{model:'gemini-3.8-flash-tts',voice:'Kore'});
  assert.equal(request.contents[0].parts[0].text,'Hello');
  assert.match(request.contents[0].parts[0].speech_metadata.style,/English/);
  assert.deepEqual(request.generationConfig.speechConfig.voiceConfig,{voice:'Kore'});
});
test('Gemini retry waits respect RetryInfo and Retry-After without exceeding 60 seconds',()=>{
  const info={error:{details:[{'@type':'type.googleapis.com/google.rpc.RetryInfo',retryDelay:'12.5s'}]}};
  assert.equal(geminiRetryDelayMs(429,{},info),12500);
  assert.equal(geminiRetryDelayMs(503,{'Retry-After':'20'},info),20000);
  assert.equal(geminiRetryDelayMs(500,new Headers({'Retry-After':'120'}),{}),60000);
  assert.equal(geminiRetryDelayMs(503,{'retry-after':'Thu, 01 Jan 1970 00:00:15 GMT'},{},0,10000),5000);
  assert.equal(geminiRetryDelayMs(500,{},{}),1000);
  assert.equal(geminiRetryDelayMs(500,{}, {},3),8000);
  assert.equal(geminiRetryDelayMs(401,{},{}),null);
});
test('Gemini daily and zero quotas stop immediately but minute-rate limits can retry',()=>{
  const quota=(quotaId,quotaValue)=>({error:{details:[{'@type':'type.googleapis.com/google.rpc.QuotaFailure',violations:[{quotaId,quotaValue}]}]}});
  assert.equal(geminiQuotaExhausted(quota('GenerateRequestsPerDayPerProjectPerModel-FreeTier','100')),true);
  assert.equal(geminiRetryDelayMs(429,{},quota('GenerateRequestsPerMinutePerProjectPerModel-FreeTier','0')),null);
  assert.equal(geminiQuotaExhausted(quota('GenerateRequestsPerMinutePerProjectPerModel-FreeTier','10')),false);
  assert.equal(geminiRetryDelayMs(429,{},quota('GenerateRequestsPerMinutePerProjectPerModel-FreeTier','10')),1000);
  assert.equal(geminiRetryDelayMs(429,{},{error:{message:'Quota exceeded; limit: 0'}}),null);
});
test('Gemini no-audio metadata is limited to safe enums, never provider payload strings',()=>{
  assert.deepEqual(geminiAudioMetadata({candidates:[{finishReason:'STOP'}]}),{finishReason:'STOP',blockReason:'ABSENT',blocked:false});
  assert.deepEqual(geminiAudioMetadata({promptFeedback:{blockReason:'SAFETY'}}),{finishReason:'ABSENT',blockReason:'SAFETY',blocked:true});
  const metadata=geminiAudioMetadata({candidates:[{finishReason:'arbitrary sensitive provider string'}]});
  assert.equal(metadata.finishReason,'UNKNOWN');
  assert.equal(JSON.stringify(metadata).includes('sensitive'),false);
});
test('Gemini retries empty audio up to three times and marks only that error skippable',async()=>{
  let attempts=0;const waits=[];
  const empty={candidates:[{finishReason:'STOP',content:{parts:[{text:'not audio'}]}}]};
  const io={fetch:async()=>{attempts++;return {ok:true,json:async()=>empty};},sleep:async ms=>waits.push(ms),log:()=>{}};
  await assert.rejects(gemini({text:'hello',lang:'en'},{model:'gemini-2.5-flash-preview-tts',voice:'Kore'},'test-only',io),error=>canContinueAudioBatch(error));
  assert.equal(attempts,3);assert.deepEqual(waits,[1000,2000]);
  assert.equal(canContinueAudioBatch({code:'GEMINI_BLOCKED'}),false);
  assert.equal(canContinueAudioBatch(new Error('HTTP 429')),false);
});
test('Gemini explicit blocks stop immediately; an empty transient response can recover',async()=>{
  const options={model:'gemini-2.5-flash-preview-tts',voice:'Kore'},clip={text:'hello',lang:'en'};
  let attempts=0;
  await assert.rejects(gemini(clip,options,'test-only',{fetch:async()=>{attempts++;return {ok:true,json:async()=>({promptFeedback:{blockReason:'SAFETY'}})};},sleep:async()=>{},log:()=>{}}),error=>error.code==='GEMINI_BLOCKED');
  assert.equal(attempts,1);
  const pcm=Buffer.alloc(480);attempts=0;
  const result=await gemini(clip,options,'test-only',{fetch:async()=>({ok:true,json:async()=>++attempts===1?{candidates:[{finishReason:'STOP'}]}:{candidates:[{content:{parts:[{inlineData:{mimeType:'audio/L16;rate=24000',data:pcm.toString('base64')}}]}}]}}),sleep:async()=>{},log:()=>{}});
  assert.equal(attempts,2);assert.equal(result.toString('ascii',0,4),'RIFF');
});
test('feedback catalog contains bilingual variations without changing the original recording text',()=>{
 const catalog=collectCatalog([]);
 assert.equal(catalog.filter(c=>c.id.startsWith('feedback.success.')).length,6);
 assert.equal(catalog.filter(c=>c.id.startsWith('feedback.retry.')).length,6);
 assert.equal(catalog.find(c=>c.id==='feedback.success.he').text,'כל הכבוד! הצלחת!');
 assert.equal(catalog.find(c=>c.id==='feedback.retry.en').text,'Let’s try again, slowly.');
});


test('Gemini resume preserves approved ElevenLabs files but invalidates changed content and unsafe paths', async()=>{
 const {reusableRecording}=await import('./generate-audio.mjs');
 const clip={id:'he-alef-hello',text:'זאת האות אלף',lang:'he'};
 const existing={...clip,engine:'elevenlabs',status:'ready',src:'audio/he-alef-hello.elevenlabs.mp3',fingerprint:'other-provider'};
 assert.equal(reusableRecording(existing,clip,{engine:'gemini',model:'test',voice:'Kore'}),true);
 assert.equal(reusableRecording({...existing,text:'different'},clip,{engine:'gemini'}),false);
 assert.equal(reusableRecording({...existing,src:'../private.mp3'},clip,{engine:'gemini'}),false);
});
