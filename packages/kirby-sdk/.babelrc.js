const { BABEL_ENV } = process.env;
const loose = true;

module.exports = {
  presets: [['@babel/preset-env', { loose, modules: false }], '@babel/preset-typescript'],
  env: {
    commonjs: {
      module: 'commonjs',
      target: 'ES3',
      presets: [['@babel/transform-modules-commonjs', { loose }], '@babel/preset-typescript'],
      plugins: ['@babel/plugin-transform-modules-commonjs'],
    },
  },
};
