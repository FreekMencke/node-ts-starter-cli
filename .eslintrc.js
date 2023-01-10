module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'indent': ['error', 2],
    'quotes': [
      'error',
      'single',
      {
        avoidEscape: true,
      },
    ],
    'comma-dangle': ['error', 'always-multiline'],
    'no-multiple-empty-lines': ['error', { max: 1 }],
    'no-redeclare': 'error',
    'no-return-await': 'error',
    'prefer-const': 'error',
    'semi': ['error', 'always'],
  },
};
