// http://eslint.org/docs/user-guide/configuring
module.exports = {
  parser: 'babel-eslint',
  env: {
    browser: true,
  },
  extends: [
    'airbnb-base',
    'plugin:react/recommended'
  ],
  plugins: [
    'react',
  ],
  settings: {
    'import/resolver': {
      webpack: {
        config: 'webpack.config.js',
      },
    },
  },
  rules:{
    'class-methods-use-this': 0,
  }
};