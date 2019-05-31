module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  plugins: [
    'html'
  ],
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: 'standard',
  rules: {}
}