import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';

export function filesAt(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? filesAt(resolve(dir,e.name)) : [resolve(dir,e.name)]);
}
export function verifyPublicBuild(root = process.cwd()) {
  const output = resolve(root,'dist');
  assert(existsSync(resolve(output,'index.html')), 'Public output is missing index.html');
  assert(!existsSync(resolve(output,'portraits')), 'Private portrait directory in public output');
  const hash = file => createHash('sha256').update(readFileSync(file)).digest('hex');
  const privateHashes = new Set(filesAt(resolve(root,'public/portraits')).filter(f=>/\.(webp|png|jpe?g)$/i.test(f)).map(hash));
  const forbidden = /\.(pdf|env)$/i;
  const files = filesAt(output);
  for (const file of files) {
    assert(!forbidden.test(file), `Private document in public output: ${relative(output,file)}`);
    assert(!privateHashes.has(hash(file)), `Private photo copied into output: ${relative(output,file)}`);
    if (/\.(js|html|json|css|txt)$/i.test(file)) {
      const text=readFileSync(file,'utf8');
      assert(!/(?:ghp_[A-Za-z0-9]{20,}|sk-proj-[A-Za-z0-9_-]{20,})/.test(text), 'Credential pattern in output');
    }
  }
  console.log(`Public build verified: ${files.length} files, no private portraits or documents.`);
}
if (process.argv[1] && resolve(process.argv[1]) === import.meta.filename) verifyPublicBuild();
