module.exports = {
  plugins: [
    '@babel/transform-react-jsx',
    '@babel/plugin-proposal-optional-chaining'
  ],
  presets: [
    [
      '@babel/preset-react',
      {
        development: process.env.NODE_ENV === 'development'
      }
    ],

    '@babel/preset-typescript'
  ],
  env: {
    test: {
      presets: ['@babel/env']
    }
  }
};
