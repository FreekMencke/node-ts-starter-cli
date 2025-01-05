import stylistic from '@stylistic/eslint-plugin';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const rules = {
  '@stylistic/indent': ['error', 2],
  '@stylistic/member-delimiter-style': [
    'error',
    {
      multiline: {
        delimiter: 'semi',
        requireLast: true,
      },
      singleline: {
        delimiter: 'semi',
        requireLast: false,
      },
    },
  ],
  '@stylistic/quotes': [
    'error',
    'single',
    {
      avoidEscape: true,
    },
  ],
  '@stylistic/semi': ['error', 'always'],
  'comma-dangle': ['error', 'always-multiline'],
  'max-classes-per-file': 'off',
  'no-console': 'error',
  'no-multiple-empty-lines': ['error', { max: 1 }],
  'no-redeclare': 'error',
  'no-return-await': 'error',
  'prefer-const': 'error',
};

export default tseslint.config(
  {
    ignores: ['node_modules', '.vscode', 'dist/'],
  },
  {
    files: ['**/*.{js,cjs,mjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.node,
    },
    plugins: { '@stylistic': stylistic },
    rules: rules,
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.node,
      parser: tseslint.parser,
      parserOptions: {
        project: ['tsconfig.json', 'tsconfig.eslint.json'],
      },
    },
    plugins: { '@stylistic': stylistic },
    rules: rules,
  },
);
