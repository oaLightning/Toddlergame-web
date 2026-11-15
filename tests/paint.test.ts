import test from 'node:test';
import assert from 'node:assert/strict';
import {outlineFor,paintPoint} from '../src/games/paint-art.ts';
test('painting maps resized mouse/touch coordinates into a stable viewBox and clamps edges',()=>{
 assert.deepEqual(paintPoint(200,150,{left:50,top:45,width:300,height:210}),{x:300,y:210});
 assert.deepEqual(paintPoint(0,1000,{left:50,top:45,width:300,height:210}),{x:0,y:420});
});
test('letter painting uses objects with matching starting letters and explicit outlines can override',()=>{
 assert.equal(outlineFor('א').name,'אבטיח');assert.equal(outlineFor('ב').name,'בננה');assert.equal(outlineFor('ג').name,'גזר');assert.equal(outlineFor('ד').name,'דג');
 assert.equal(outlineFor('a').name,'apple');assert.equal(outlineFor('s').name,'sun');assert.equal(outlineFor('t').name,'turtle');assert.equal(outlineFor('m').name,'moon');
 assert.equal(outlineFor('a','fish').name,'דג');
 assert.equal(outlineFor('t','tree').name,'tree');assert.equal(outlineFor('12').glyph,'12');
});
