import test from 'node:test';
import assert from 'node:assert/strict';
import { keyboardRows, keyboardValue, defaultSequences } from '../src/games/typing-logic.ts';
test('Hebrew accepts active Hebrew layout and physical English-layout locations',()=>{
  assert.equal(keyboardValue('א','KeyT','he'),'א');
  for(const [code,value] of [['KeyT','א'],['KeyC','ב'],['KeyD','ג'],['KeyS','ד']])assert.equal(keyboardValue(code.slice(-1).toLowerCase(),code,'he'),value);
  assert.equal(keyboardValue('Escape','Escape','he'),null);
});
test('English letters normalize case; numeric keypad and number row agree',()=>{
  assert.equal(keyboardValue('S','KeyS','en'),'s');
  assert.equal(keyboardValue('1','Numpad1','numbers'),'1');
  assert.equal(keyboardValue('End','Numpad1','numbers'),'1');
  assert.equal(keyboardValue('א','KeyT','en'),'t');
});
test('rendered Hebrew keys use the same physical positions as input mapping',()=>{
  for(const row of keyboardRows('he'))for(const key of row)if(key.value)assert.equal(keyboardValue('',key.code,'he'),key.value);
  assert.equal(keyboardRows('he')[0][4].value,'א');
  assert.equal(keyboardRows('he')[1][1].value,'ד');
  assert.equal(keyboardRows('he')[1][2].value,'ג');
  assert.equal(keyboardRows('he')[2][2].value,'ב');
});
test('repeat sequences are short and use supplied known letters only',()=>{
  const targets=['א','ב','ג','ד'];
  const sequences=defaultSequences(targets);
  assert.deepEqual(sequences.map(s=>[...s].length),[2,3,4]);
  assert.ok(sequences.every(s=>[...s].every(ch=>targets.includes(ch))));
});
