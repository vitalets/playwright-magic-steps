import globals from 'globals';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';

export default [
  {
    ignores: ['dist'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ['**/*.{ts,js}'],
    rules: {
      'no-console': 'error',

      // complexity was set to 7 after update to eslint 9 as they changed the algorithm
      // could be resolved via custom rule visual-complexity
      // see: https://github.com/eslint/eslint/issues/18432
      complexity: ['error', { max: 7 }],
      'max-depth': ['error', { max: 2 }],
      'max-nested-callbacks': ['error', { max: 2 }],
      'max-params': ['error', { max: 3 }],
      'max-statements': [
        'error',
        { max: 12 },
        { ignoreTopLevelFunctions: false },
      ],
      'max-len': ['error', { code: 120, ignoreUrls: true }],
      'max-lines': [
        'error',
        { max: 200, skipComments: true, skipBlankLines: true },
      ],
      semi: ['error', 'always'],
      'no-multiple-empty-lines': ['error', { max: 1 }],
      'space-before-function-paren': [
        'error',
        { anonymous: 'always', named: 'never', asyncArrow: 'always' },
      ],
      '@typescript-eslint/triple-slash-reference': 0,
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
      'no-undef': 0,
      'no-empty-pattern': 0,
      '@typescript-eslint/no-var-requires': 0,
    },
  },
  {
    files: ['test/**/*.{ts,js}'],
    plugins: {
      playwright,
    },
    rules: {
      'max-params': 0,
      'max-statements': 0,
      'no-empty-pattern': 0,
      '@typescript-eslint/no-empty-function': 0,
      'playwright/no-focused-test': 'error',
    },
  },
];
