import test from 'node:test';
import assert from 'node:assert/strict';
import {advanceFreezeTarget,freezeSpeed,initialFreezeTarget} from '../src/games/freeze-logic.ts';

test('targets traverse the arena rather than hovering around a small anchor',()=>{
 let target=initialFreezeTarget(0,27,22),minX=target.x,maxX=target.x,minY=target.y,maxY=target.y;
 for(let i=0;i<600;i++){
  target=advanceFreezeTarget(target,1/60,freezeSpeed(0),.12,.1);
  minX=Math.min(minX,target.x);maxX=Math.max(maxX,target.x);minY=Math.min(minY,target.y);maxY=Math.max(maxY,target.y);
 }
 assert(maxX-minX>.6);assert(maxY-minY>.6);
});
test('each freeze increases travel speed and final target remains bounded through bounces',()=>{
 for(let n=0;n<7;n++)assert(freezeSpeed(n+1)>freezeSpeed(n));
 assert(freezeSpeed(7)>3);
 for(let index=0;index<8;index++){
  let target=initialFreezeTarget(index,.5*100,.5*100);
  for(let frame=0;frame<4000;frame++){
   target=advanceFreezeTarget(target,frame%2?.017:5,freezeSpeed(7),.14,.11);
   assert(target.x>=.14&&target.x<=.86);assert(target.y>=.11&&target.y<=.89);
  }
 }
});
test('right and left walls reflect horizontal direction without teleporting',()=>{
 const right=advanceFreezeTarget({x:.895,y:.5,vx:.2,vy:0},.05,1,.1,.1);
 assert(right.x<.9&&right.vx<0);
 const left=advanceFreezeTarget({x:.105,y:.5,vx:-.2,vy:0},.05,1,.1,.1);
 assert(left.x>.1&&left.vx>0);
 assert.deepEqual(advanceFreezeTarget({x:.5,y:.5,vx:.2,vy:.1},0,1,.1,.1),{x:.5,y:.5,vx:.2,vy:.1});
});
