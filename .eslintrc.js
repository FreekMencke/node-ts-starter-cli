module.exports = {
  env: {
    es2022: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'indent': ['error', 2],
    'quotes': ['error', 'single', { avoidEscape: true }],
    'comma-dangle': ['error', 'always-multiline'],
    'no-multiple-empty-lines': ['error', { max: 1 }],
    'no-redeclare': 'error',
    'no-return-await': 'error',
    'prefer-const': 'error',
    'semi': ['error', 'always'],
  },
};
