import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const root = fileURLToPath(new URL('../', import.meta.url));
const server = await createServer({ root, server: { middlewareMode: true }, appType: 'custom', optimizeDeps: { noDiscovery: true, include: [], entries: [] } });
try {
  const { lessons } = await server.ssrLoadModule('/src/content/index.ts');
  const ids = new Set();
  const kinds = new Set(['introduce', 'trace', 'find', 'match', 'color', 'select', 'paint', 'count', 'arithmetic', 'keypad', 'build', 'freeze', 'puzzle', 'keybash', 'typing']);
  const plain = s => s.normalize('NFD').replace(/[\u0591-\u05C7]/g, '');
  const asset = path => assert(existsSync(resolve(root, 'public', path.replace(/^\.\//, ''))), `Missing asset: ${path}`);
  let pages = 0;
  for (const lesson of lessons) {
    assert(!ids.has(lesson.id), `Duplicate lesson ID: ${lesson.id}`); ids.add(lesson.id);
    assert(lesson.pages.length > 0, `Empty lesson: ${lesson.id}`);
    const pageIds = new Set();
    for (const p of lesson.pages) {
      const label = `${lesson.id}/${p.id}`;
      assert(!pageIds.has(p.id), `Duplicate page ID: ${label}`); pageIds.add(p.id);
      assert(kinds.has(p.kind), `Unsupported kind: ${label}`);
      assert(p.instruction?.trim(), `Missing instruction: ${label}`);
      if (p.kind === 'trace') assert(p.target && p.strokes?.length, `Missing explicit trace strokes: ${label}`);
      if (p.kind === 'find') assert(plain(p.text ?? '').includes(plain(p.target ?? '\0')), `No find target: ${label}`);
      if (['match', 'color', 'select'].includes(p.kind)) {
        assert(p.choices?.length >= 2, `Not enough choices: ${label}`);
        assert(p.choices.some(c => c.correct), `No correct choice: ${label}`);
        assert(p.choices.some(c => !c.correct), `No distractor: ${label}`);
      }
      if (p.choices) assert(new Set(p.choices.map(c => c.id)).size === p.choices.length, `Duplicate choice IDs: ${label}`);
      if (p.kind === 'count') assert(Number.isInteger(p.count) && p.count >= 0 && p.count <= 20 && p.answer === p.count, `Invalid count: ${label}`);
      if (p.kind === 'arithmetic') {
        const [a,b] = p.operands ?? [];
        const result = p.operation === '+' ? a+b : a-b;
        assert(['+', '-'].includes(p.operation) && [a,b,result].every(n => Number.isInteger(n) && n >= 0 && n <= 10), `Invalid arithmetic: ${label}`);
        if (p.answer !== undefined) assert.equal(p.answer, result, `Wrong answer: ${label}`);
      }
      if (p.kind === 'typing') {
        assert(['find', 'repeat'].includes(p.typingMode), `Invalid typing mode: ${label}`);
        assert(['he', 'en', 'numbers'].includes(p.keyboardLocale), `Invalid keyboard locale: ${label}`);
        assert(p.typingMode === 'find' ? p.targets?.length : p.sequences?.length, `Empty typing activity: ${label}`);
      }
      if (p.kind === 'build') {
        const letters = [...(p.letters ?? [])];
        for (const letter of [...plain(p.target ?? '')]) { const i = letters.indexOf(letter); assert(i >= 0, `Cannot build ${label}: ${letter}`); letters.splice(i,1); }
      }
      for (const item of [...(p.examples ?? []), ...(p.choices ?? [])]) if (item.image) asset(item.image);
      pages++;
    }
  }
  for (const catalog of ['characters', 'portraits']) {
    const manifest = resolve(root, `public/${catalog}/manifest.json`);
    if (!existsSync(manifest)) { assert(catalog === 'portraits', `Missing catalog: ${catalog}`); continue; }
    const entries = JSON.parse(readFileSync(manifest, 'utf8'));
    for (const entry of entries) asset(entry.src);
  }
  console.log(`Validated ${lessons.length} books, ${pages} exercise pages, and character/portrait asset references.`);
} finally { await server.close(); }
