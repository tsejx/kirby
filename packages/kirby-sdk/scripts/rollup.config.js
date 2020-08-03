const typescript = require('@rollup/plugin-typescript');
const commonjs = require('@rollup/plugin-commonjs');
const babel = require('@rollup/plugin-babel').babel;
const nodeResolve = require('@rollup/plugin-node-resolve').nodeResolve;
const { uglify } = require('rollup-plugin-uglify');
const { minify } = require('uglify-es');

const pkg = require('../package.json');

const isPro = process.env.NODE_ENV === 'production';

const banner =
  `${'/*!\n' + ' * '}${pkg.name}.js v${pkg.version}\n` +
  ` * (c) 2020-${new Date().getFullYear()} ${pkg.author}\n` +
  ` * Released under the MIT License.\n` +
  ` */`;

module.exports = {
  input: 'src/index.ts',
  output: {
    name: 'kirby-sdk',
    file: isPro ? 'dist/kirby-sdk.min.js' : 'dist/kirby-sdk.js',
    format: 'umd',
    sourcemap: true,
    banner,
  },
  plugins: [
    typescript({
      target: 'es5',
      declaration: false,
    }),
    nodeResolve(),
    commonjs({
      include: 'node_modules/**',
    }),
    babel({
      runtimeHelpers: true,
      exclude: 'node_modules/**',
      babelHelpers: 'bundled',
    }),
    isPro && uglify({}, minify),
  ].filter(Boolean),
};
