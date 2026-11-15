import { defineConfig, loadEnv } from 'vite';
import { cpSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

export default defineConfig(({ mode, command }) => {
  const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env };
  const privatePhotos = env.VITE_INCLUDE_PRIVATE_PHOTOS === 'true';
  if (env.GITHUB_ACTIONS === 'true' && privatePhotos) throw new Error('GitHub Actions must never build private portraits.');
  return {
    base: './',
    server: { watch: { ignored: ['**/public/audio/**'] } },
    // Public builds copy an allowlist, rather than copying portraits and deleting them later.
    publicDir: privatePhotos || command === 'serve' ? 'public' : false,
    plugins: [{
      name: 'copy-public-only-media',
      closeBundle() {
        if (privatePhotos || command !== 'build') return;
        for (const folder of ['characters', 'audio', 'fonts']) {
          const source = resolve('public', folder);
          if (existsSync(source)) cpSync(source, resolve('dist', folder), { recursive: true });
        }
      },
    }],
  };
});
