import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { speechClipId } from '../src/audio-policy.ts';
import { freezeDuration } from '../src/games/freeze-logic.ts';

test('each freeze increases speed while preserving a safe lower duration bound', () => {
  for(let index=0;index<8;index++)for(let count=0;count<7;count++){
    assert(freezeDuration(index,count+1)<freezeDuration(index,count));
    assert(freezeDuration(index,count+1)>=1.2);
  }
  assert.equal(freezeDuration(0,100),1.2);
});
test('runtime number and key speech resolves to the generated catalog IDs',()=>{
  assert.equal(speechClipId('20','he'),'number.he.20');
  assert.equal(speechClipId('0','en'),'number.en.0');
  assert.equal(speechClipId('אלף','he'),'key.he.alef');
  assert.equal(speechClipId('S','en'),'key.en.s');
  assert.equal(speechClipId('21','he'),undefined);
});
test('bundled hit and miss WAVs contain actual audible PCM samples',()=>{
  for(const name of ['success','bump']){
    const wav=readFileSync(new URL(`../public/audio/effects/${name}.wav`,import.meta.url));
    assert.equal(wav.toString('ascii',0,4),'RIFF');
    assert.equal(wav.toString('ascii',8,12),'WAVE');
    assert(wav.length>5000);
    let peak=0;for(let i=44;i+1<wav.length;i+=2)peak=Math.max(peak,Math.abs(wav.readInt16LE(i)));
    assert(peak>1000);
  }
});

test('reward cameos move between screen corners without repeating the last corner',async()=>{
  const {nextCameoSpot,cameoSpots}=await import('../src/cameos.ts');
  for(const previous of cameoSpots)for(const random of [0,.33,.66,.99]){
    const next=nextCameoSpot(previous,random);
    assert.notEqual(next,previous);
    assert(cameoSpots.includes(next));
  }
});
