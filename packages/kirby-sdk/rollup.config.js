const babel = require('@rollup/plugin-babel').babel;
const typescript = require('@rollup/plugin-typescript');
const buble = require('@rollup/plugin-buble');
// const commonjs = require('@rollup/plugin-commonjs');
// const resolve = require('@rollup/plugin-node-resolve');
const { uglify } = require('rollup-plugin-uglify');
const pkg = require('./package.json');

module.exports = {
  input: 'src/index.ts',
  output: [
    // { format: 'umd', file: 'lib/kirby.js' },
    { format: 'cjs', file: pkg.main },
    { format: 'es', file: pkg.module },
  ],
  plugins: [
    typescript(),
    buble(),
    babel({
      presets: [['@babel/preset-env', { targets: { node: 8 } }]],
      exclude: 'node_modules/**',
      babelHelpers: 'bundled'
    }),
    uglify(),
  ],
};
