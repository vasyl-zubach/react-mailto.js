const path = require('path');

const jsRule = {
    test: /\.js$/,
    exclude: /node_modules/,
    use: {
        loader: 'babel-loader',
        options: {
            cacheDirectory: path.resolve(__dirname, '.cache')
        }
    }
};

// load the default config generator.
const genDefaultConfig = require('@storybook/react/dist/server/config/defaults/webpack.config.js');

module.exports = (baseConfig, env) => {
  const config = genDefaultConfig(baseConfig, env);

  config.module.rules = [];
  config.module.rules.push(jsRule);

  config.resolve.extensions.push('.ts', '.js', '.jsx', '.tsx');

  config.stats = 'errors-only';

  return config;
};
