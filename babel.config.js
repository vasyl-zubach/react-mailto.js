module.exports = {
  plugins: ['@babel/transform-react-jsx', '@babel/plugin-transform-runtime'],
  presets: [
    '@babel/react',
    '@babel/typescript',
    [
      '@babel/env',
      {
        debug: false,
        targets: {
          browsers: 'last 2 versions, ie >= 11'
        },
        modules: 'commonjs'
        // useBuiltIns: 'usage',
        // corejs: '3.0.0'
        // shippedProposals: true,
      }
    ]
  ]
};
