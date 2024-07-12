import prettier from 'eslint-config-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['node_modules', '.vscode', 'dist/'],
  },
  {
    files: ['**/*.{js,cjs,mjs}', '**/*.ts'],
    extends: [prettier],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.node,
      parser: tseslint.parser,
      parserOptions: {
        project: ['tsconfig.json', 'tsconfig.eslint.json'],
      },
    },
    plugins: { '@typescript-eslint': tseslint.plugin },
    rules: {
      '@typescript-eslint/indent': ['error', 2],
      '@typescript-eslint/member-delimiter-style': [
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
      '@typescript-eslint/quotes': [
        'error',
        'single',
        {
          avoidEscape: true,
        },
      ],
      '@typescript-eslint/semi': ['error', 'always'],
      'comma-dangle': ['error', 'always-multiline'],
      'max-classes-per-file': 'off',
      'no-console': 'error',
      'no-multiple-empty-lines': ['error', { max: 1 }],
      'no-redeclare': 'error',
      'no-return-await': 'error',
      'prefer-const': 'error',
    },
  },
);
