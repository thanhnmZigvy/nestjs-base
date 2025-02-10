/* eslint-disable @typescript-eslint/naming-convention */
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import _import from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const rules = {
  // Severity 2
  '@typescript-eslint/no-unused-vars': [
    2,
    {
      vars: 'all',
      argsIgnorePattern: '^_',
      destructuredArrayIgnorePattern: '^_',
    },
  ],

  'simple-import-sort/imports': 2,
  '@typescript-eslint/adjacent-overload-signatures': 2,
  '@typescript-eslint/array-type': [
    2,
    {
      default: 'array',
      readonly: 'generic',
    },
  ],
  '@typescript-eslint/member-delimiter-style': [
    2,
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
  'prefer-template': 2,
  'prefer-destructuring': 2,
  'object-shorthand': 2,
  curly: 2,
  '@typescript-eslint/naming-convention': [
    2,
    {
      selector: 'variable',
      format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
    },
  ],
  'import/extensions': [
    2,
    'ignorePackages',
    {
      '': 'never',
      js: 'never',
      jsx: 'never',
      ts: 'never',
      tsx: 'never',
    },
  ],

  // Severity 1
  '@typescript-eslint/consistent-type-imports': 1,

  'max-len': [
    1,
    {
      code: 150,
    },
  ],

  // Severity 0
  '@typescript-eslint/interface-name-prefix': 0,
  '@typescript-eslint/explicit-function-return-type': 0,
  '@typescript-eslint/explicit-module-boundary-types': 0,
  '@typescript-eslint/no-explicit-any': 0,
  'react/react-in-jsx-scope': 0,
  'import/no-extraneous-dependencies': 0,
  'import/prefer-default-export': 0,
  'class-methods-use-this': 0,
  '@typescript-eslint/indent': 0,
  'no-unused-vars': 0,
  '@typescript-eslint/explicit-member-accessibility': [
    0,
    {
      overrides: {
        constructors: 'off',
      },
    },
  ],
  'prettier/prettier': 0,
  'react/jsx-filename-extension': 0,
};

const plugins = {
  '@typescript-eslint': fixupPluginRules(typescriptEslint),
  prettier: fixupPluginRules(prettier),
  'simple-import-sort': simpleImportSort,
  import: fixupPluginRules(_import),
};
const languageOptions = {
  globals: {
    ...globals.node,
    ...globals.jest,
  },

  parser: tsParser,
  ecmaVersion: 5,
  sourceType: 'module',

  parserOptions: {
    project: 'tsconfig.json',
    // tsconfigRootDir: '/Volumes/Data/Zigvy/yupmd-be',
  },
};

export default tseslint.config(
  {
    ignores: ['src/athenaHealth/types', 'src/types/kysely-codegen.ts'],
  },
  ...fixupConfigRules(
    compat.extends(
      'plugin:@typescript-eslint/recommended',
      'plugin:prettier/recommended',
      'plugin:import/typescript',
      'plugin:prettier/recommended',
      'eslint:recommended',
      'airbnb-typescript/base',
      'airbnb-typescript',
    ),
  ),
  {
    plugins,
    languageOptions,
    rules,
  },
);
