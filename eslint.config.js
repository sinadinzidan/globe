// Frontend lint configuration enforcing docs/standards/.
// Copy this file and the eslint-rules/ folder into the frontend project root.

import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import unicorn from 'eslint-plugin-unicorn';
import checkFile from 'eslint-plugin-check-file';
import prettier from 'eslint-config-prettier';
import enumRules from './eslint-rules/enumRules.js';

const BOOLEAN_PREFIXES = ['is', 'has', 'can', 'should', 'did', 'will'];

export default tseslint.config(
  {
    ignores: [
      'dist',
      'node_modules',
      'eslint.config.js',
      'eslint-rules',
      // Written by the shadcn CLI and never edited by hand (see 07). Names and code are set by the tool.
      'src/components/ui',
      // Written by Orval from the backend's OpenAPI document and never edited by hand (see 03).
      'src/api/generated',
      // The backend has its own lint configuration.
      'backend',
      // Configuration of the client generator. Its option names are set by the tool.
      'orval.config.ts',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,

  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.browser,
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      unicorn,
      'check-file': checkFile,
      'local-enum': enumRules,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // 02 · File and folder naming: .tsx PascalCase, .ts camelCase, folders kebab-case.
      'check-file/filename-naming-convention': [
        'error',
        { '**/*.tsx': 'PASCAL_CASE', '**/*.ts': 'CAMEL_CASE' },
        // Tool-mandated names are exempt (see 02). Add a pattern here only when a tool requires it.
        { ignoreMiddleExtensions: true },
      ],
      'check-file/folder-naming-convention': ['error', { 'src/**/': 'KEBAB_CASE' }],

      // 02 · Variable names: full words, no single letters, no abbreviations.
      'id-length': ['error', { min: 2, properties: 'never' }],
      'unicorn/name-replacements': [
        'error',
        {
          checkFilenames: false,
          allowList: { id: true, url: true, api: true, html: true, http: true },
        },
      ],

      // 02 · Naming: booleans prefixed, enums, constants.
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: ['variable', 'parameter', 'property', 'accessor'],
          types: ['boolean'],
          format: ['PascalCase'],
          prefix: BOOLEAN_PREFIXES,
          filter: {
            regex: '^(disabled|checked|hidden|readOnly|required|selected|[a-z]+-[a-z-]+)$',
            match: false,
          },
        },
        { selector: 'enum', format: ['PascalCase'] },
        { selector: 'enumMember', format: ['UPPER_CASE'] },
        {
          selector: 'variable',
          modifiers: ['const', 'global'],
          types: ['string', 'number'],
          format: ['UPPER_CASE'],
        },
      ],
      'local-enum/enum-value-matches-key': 'error',

      // 02 · No magic values.
      '@typescript-eslint/no-magic-numbers': [
        'error',
        {
          ignore: [0, 1, -1],
          ignoreArrayIndexes: true,
          ignoreEnums: true,
          ignoreReadonlyClassProperties: true,
          ignoreTypeIndexes: true,
          ignoreNumericLiteralTypes: true,
        },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'BinaryExpression[operator=/^[!=]==?$/] > Literal[value=/.+/][raw=/^[\'"]/]',
          message: 'Do not compare against a string literal. Use an enum or a named constant.',
        },
        {
          selector: 'SwitchCase > Literal',
          message: 'Do not switch on a literal. Use an enum or a named constant.',
        },
        {
          selector: 'TSUnionType > TSLiteralType > Literal[raw=/^[\'"]/]',
          message: 'Do not use a string-literal union. Use an enum.',
        },
      ],
    },
  },

  // File names fixed by tooling are exempt from the naming rule (see 02). Add to this list only when a tool requires the name.
  {
    files: ['**/vite-env.d.ts'],
    rules: { 'check-file/filename-naming-convention': 'off' },
  },

  // Must be last: turns off rules that conflict with Prettier.
  prettier,
);
