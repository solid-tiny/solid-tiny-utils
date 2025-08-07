import type { Options } from 'tsup';

export default (<Options>{
  entry: ['./src/index.ts', './src/*/*.ts'],
  format: 'esm',
  outDir: './dist',
  dts: true,
  clean: true,
});
