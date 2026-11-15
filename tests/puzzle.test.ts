import test from 'node:test';
import assert from 'node:assert/strict';
import { pieceCanSnap,puzzleGrid,shuffledPieces } from '../src/games/puzzle.ts';
test('puzzle layouts produce requested piece counts',()=>{for(const count of [20,30,40,60]){const grid=puzzleGrid(count);assert.equal(grid.columns*grid.rows,count);}});
test('puzzle snapping accepts toddler leeway but rejects another slot',()=>{assert(pieceCanSnap(125,120,100,100,50,50));assert(!pieceCanSnap(150,100,100,100,50,50));assert(!pieceCanSnap(100,150,100,100,50,50));assert(!pieceCanSnap(0,0,0,0,0,0));});
test('shuffled tray contains each piece exactly once',()=>{const pieces=shuffledPieces(60,()=>.3);assert.equal(new Set(pieces).size,60);assert.deepEqual([...pieces].sort((a,b)=>a-b),Array.from({length:60},(_,i)=>i));});
