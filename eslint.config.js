import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
  prettier,
  {
    ignores: ['example/', 'templates/eslint/'],
  },
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.node,
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
  },
];
