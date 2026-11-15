import {test} from 'node:test';
import assert from 'node:assert/strict';
import {normalizedInk,numeralTemplates,numeralSlots,recognizeDigit} from '../src/games/numeral-input.ts';

test('offline handwriting suggestions recognize all ten digits independent of scale and translation',()=>{
 for(const [digit,strokes] of Object.entries(numeralTemplates)){
  const transformed=strokes.map(stroke=>stroke.map(p=>({x:p.x*1.6+43,y:p.y*1.6+29})));
  assert.equal(recognizeDigit(transformed)[0]?.digit,digit,`digit ${digit}`);
 }
});
test('a tap or tiny mark is uncertain instead of an answer',()=>{
 assert.deepEqual(recognizeDigit([[{x:1,y:1}]]),[]);
 assert.deepEqual(recognizeDigit([[{x:1,y:1},{x:2,y:2},{x:3,y:3}]]),[]);
 assert.deepEqual(normalizedInk([]),[]);
});
test('number mosaics have separated toddler targets inside their board',()=>{
 for(const digit of '0123456789'){
  const slots=numeralSlots(digit);assert.ok(slots.length>=3&&slots.length<=16);
  for(const p of slots)assert.ok(p.x>=16&&p.x<=234&&p.y>=16&&p.y<=224);
  for(let i=0;i<slots.length;i++)for(let j=i+1;j<slots.length;j++)assert.ok(Math.hypot(slots[i].x-slots[j].x,slots[i].y-slots[j].y)>38);
 }
});

test('dense scribbles and ambiguous crosses do not become asserted digits',()=>{
 assert.deepEqual(recognizeDigit([Array.from({length:50},(_,i)=>({x:i%2?0:100,y:i*2}))]),[]);
 assert.deepEqual(recognizeDigit([[{x:0,y:0},{x:100,y:100},{x:0,y:100},{x:100,y:0}]]),[]);
 assert.deepEqual(recognizeDigit([[{x:0,y:0},{x:100,y:0},{x:100,y:100},{x:0,y:100},{x:0,y:0}]]),[]);
});
