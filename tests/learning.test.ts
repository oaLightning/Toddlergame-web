import test from 'node:test';
import assert from 'node:assert/strict';
import { answerFor, numberChoices, graphemes, plain, parseProgress, traceComplete } from '../src/learning.ts';
test('visual arithmetic answers reflect add/remove operands',()=>{assert.equal(answerFor({id:'a',kind:'arithmetic',instruction:'',operands:[3,1],operation:'-'}),2);assert.equal(answerFor({id:'b',kind:'arithmetic',instruction:'',operands:[3,1],operation:'+'}),4);});
test('answer choices include edge answers with no duplicates or negatives',()=>{for(const answer of [0,1,10,20]){const choices=numberChoices(answer);assert.ok(choices.includes(answer));assert.equal(choices.length,new Set(choices).size);assert.ok(choices.every(n=>n>=0&&n<=20));}});
test('Hebrew combining marks stay with letters for finding',()=>{assert.deepEqual(graphemes('אָבָּא'),['אָ','בָּ','א']);assert.equal(plain('אָבָּא'),'אבא');});
test('imports reject malformed progress rather than storing unrelated data',()=>{assert.deepEqual(parseProgress({version:1,completed:{'he-a/hello':true}}),{'he-a/hello':true});assert.throws(()=>parseProgress({completed:{x:'yes'}}));assert.throws(()=>parseProgress([]));});

test('tracing requires coverage on every stroke, not just a long main stroke',()=>{
  assert.equal(traceComplete([{covered:78,total:78},{covered:0,total:22}]),false);
  assert.equal(traceComplete([{covered:70,total:78},{covered:10,total:22}]),false);
  assert.equal(traceComplete([{covered:65,total:78},{covered:12,total:22}]),true);
  assert.equal(traceComplete([{covered:50,total:100},{covered:5,total:10}]),false);
  assert.equal(traceComplete([]),false);
});
