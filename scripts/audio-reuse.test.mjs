import test from 'node:test';import assert from 'node:assert/strict';
import {narrationKey,requestEstimate} from './audio-reuse.mjs';
test('reuse shares exact same-language prompts without merging phonics roles or deliberate rewards',()=>{
 assert.equal(narrationKey({id:'he-alef-paint',text:'בחרי צבע',lang:'he'}),narrationKey({id:'he-bet-paint',text:'בחרי צבע',lang:'he'}));
 for(const pair of [[{text:'ב',lang:'he'},{text:'בּ',lang:'he'}],[{text:'in',lang:'en'},{text:'in',lang:'he'}],[{id:'key.en.a',text:'A',lang:'en'},{id:'en-a.example.0',text:'A',lang:'en'}],[{id:'feedback.one',text:'Wow',lang:'en'},{id:'feedback.two',text:'Wow',lang:'en'}]])assert.notEqual(narrationKey(pair[0]),narrationKey(pair[1]));
});
test('estimates new requests after ready reuse and pending deduplication',()=>{
 const catalog=[{id:'a',text:'same',lang:'en'},{id:'b',text:'same',lang:'en'},{id:'c',text:'new',lang:'en'},{id:'d',text:'new',lang:'en'}];
 assert.deepEqual(requestEstimate(catalog,{a:{status:'ready',text:'same',lang:'en',src:'audio/a.wav'}}),{pendingEntries:3,reusableNow:1,newRequests:1});
});
