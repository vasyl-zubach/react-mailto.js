const path = require('path');

const jsRule = {
  test: /\.(j|t)sx?$/,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
    options: {
      cacheDirectory: path.resolve(__dirname, '.cache')
    }
  }
};

module.exports = async ({ config, mode }) => {
  config.module.rules.push(jsRule);

  config.resolve.extensions.push('.ts', '.js', '.jsx', '.tsx');
  config.stats = 'errors-only';

  return config;
};
