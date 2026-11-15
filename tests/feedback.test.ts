import test from 'node:test';
import assert from 'node:assert/strict';
import {successClips,retryClips,chooseFeedback} from '../src/feedback.ts';
test('random praise may mix languages but never immediately repeats an available alternative',()=>{
 assert.equal(successClips.filter(c=>c.lang==='he').length,3);
 assert.equal(successClips.filter(c=>c.lang==='en').length,3);
 for(const previous of successClips) for(const value of [0,.25,.5,.99,1]) assert.notEqual(chooseFeedback(successClips,previous.id,()=>value).id,previous.id);
 assert.equal(chooseFeedback([successClips[0]],successClips[0].id).id,successClips[0].id);
 assert.throws(()=>chooseFeedback([]),/at least one/);
});
test('retry choices can stay within the instruction language, while existing recordings keep their exact text',()=>{
 for(const lang of ['he','en']){
  const pool=retryClips.filter(c=>c.lang===lang);
  assert.equal(pool.length,3);assert.equal(chooseFeedback(pool,undefined,()=>.5).lang,lang);
 }
 assert.equal(successClips.find(c=>c.id==='feedback.success.he')?.text,'כל הכבוד! הצלחת!');
 assert.equal(successClips.find(c=>c.id==='feedback.success.en')?.text,'Well done! You did it!');
 assert.equal(retryClips.find(c=>c.id==='feedback.retry.he')?.text,'בואי ננסה שוב, לאט לאט.');
});
