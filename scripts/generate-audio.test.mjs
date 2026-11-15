import test from 'node:test';
import assert from 'node:assert/strict';
import { fingerprint, clipPath, wav, collectCatalog, narrationLang } from './generate-audio.mjs';

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
