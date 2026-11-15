import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { verifyPublicBuild } from './verify-public-build.mjs';

test('public verification rejects a portrait folder and renamed copies of private photos', () => {
  const root=mkdtempSync(join(tmpdir(),'asia-public-test-'));
  try {
    mkdirSync(join(root,'dist')); writeFileSync(join(root,'dist/index.html'),'safe page');
    mkdirSync(join(root,'public/portraits'),{recursive:true});
    writeFileSync(join(root,'public/portraits/private.webp'),'private-photo-test-bytes');
    verifyPublicBuild(root);
    mkdirSync(join(root,'dist/portraits'));
    assert.throws(()=>verifyPublicBuild(root),/portrait directory/);
    rmSync(join(root,'dist/portraits'),{recursive:true});
    writeFileSync(join(root,'dist/renamed.webp'),'private-photo-test-bytes');
    assert.throws(()=>verifyPublicBuild(root),/Private photo copied/);
  } finally { rmSync(root,{recursive:true,force:true}); }
});
