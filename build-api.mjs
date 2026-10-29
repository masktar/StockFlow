import { build } from 'esbuild';

await build({
  entryPoints: ['server.ts'],
  outfile: 'api/index.js',
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'esm',
  packages: 'external',
  banner: {
    js: `import { createRequire } from 'module';
const require = createRequire(import.meta.url);`
  }
});