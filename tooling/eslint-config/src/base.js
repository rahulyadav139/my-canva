import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';
import onlyWarn from 'eslint-plugin-only-warn';
import unusedImports from 'eslint-plugin-unused-imports';
import importPlugin from 'eslint-plugin-import';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

/**
 * A shared ESLint configuration for the repository.
 * Optimized for development performance.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const config = [
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  {
    plugins: {
      'unused-imports': unusedImports,
      import: importPlugin,
      'simple-import-sort': simpleImportSort,
    },
    settings: {
      // Simplified import resolver for better performance
      'import/resolver': {
        node: true,
        // Disabled typescript resolver for performance - let TypeScript handle this
        // typescript: true,
      },
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
    },
    rules: {
      // ============= IMPORT MANAGEMENT =============
      // Remove unused imports automatically
      // 'unused-imports/no-unused-imports': 'warn',
      // 'unused-imports/no-unused-vars': [
      //   'warn',
      //   {
      //     vars: 'all',
      //     varsIgnorePattern: '^_',
      //     args: 'after-used',
      //     argsIgnorePattern: '^_',
      //   },
      // ],
      // Disable unused imports/vars reporting
      'unused-imports/no-unused-imports': 'off',
      'unused-imports/no-unused-vars': 'off',

      // Simplified import/export ordering for better performance
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // Side effect imports
            ['^\\u0000'],
            // Node.js builtins and external packages
            ['^(node:|@?\\w)'],
            // Internal packages
            ['^@repo(/.*|$)'],
            // Parent and relative imports
            ['^\\.\\.', '^\\.'],
            // Type imports
            ['^.+\\u0000$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',

      // Import validation - Note: Some rules disabled due to TypeScript handling
      'import/no-unresolved': 'off', // TypeScript handles this
      'import/named': 'off', // TypeScript handles this
      'import/default': 'off', // TypeScript handles this
      'import/namespace': 'off', // TypeScript handles this
      // 'import/no-duplicate-imports': 'error', // Disabled - conflicts with type imports
      'import/no-self-import': 'off',
      // 'import/no-cycle': ['error', { maxDepth: 10 }], // Disabled for performance
      'import/no-useless-path-segments': 'off', // TypeScript handles this
      // 'import/consistent-type-specifier-style': ['error', 'prefer-top-level'], // Disabled for compatibility

      // ============= CODE QUALITY =============
      // Standard no-unused-vars from typescript-eslint
      '@typescript-eslint/no-unused-vars': 'off',

      // TypeScript specific
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: false,
          fixStyle: 'separate-type-imports',
        },
      ],
      // '@typescript-eslint/consistent-type-exports': 'error', // Disabled - requires type info
      '@typescript-eslint/no-import-type-side-effects': 'error',
      // '@typescript-eslint/prefer-nullish-coalescing': 'error', // Disabled - requires type info
      // '@typescript-eslint/prefer-optional-chain': 'error', // Disabled - requires type info
      // '@typescript-eslint/no-unnecessary-condition': 'warn', // Disabled - requires type info
      // '@typescript-eslint/no-unnecessary-type-assertion': 'error', // Disabled - requires type info
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/prefer-as-const': 'error',

      // General code quality
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-alert': 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-script-url': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-template': 'error',
      'object-shorthand': 'error',
      // 'prefer-destructuring': [
      //   'error',
      //   {
      //     array: false,
      //     object: true,
      //   },
      // ], // disabled for now
      // 'no-nested-ternary': 'warn', // disabled for now
      'no-unneeded-ternary': 'error',
      'spaced-comment': ['error', 'always', { markers: ['/'] }],

      // Async/Promise best practices - Note: Some disabled (require type info)
      // '@typescript-eslint/await-thenable': 'error', // Disabled - requires type info
      // '@typescript-eslint/no-floating-promises': 'error', // Disabled - requires type info
      // '@typescript-eslint/no-misused-promises': 'error', // Disabled - requires type info
      // '@typescript-eslint/promise-function-async': 'error', // Disabled - requires type info

      // Array and object best practices - Note: Some disabled (require type info)
      '@typescript-eslint/prefer-for-of': 'error',
      // '@typescript-eslint/prefer-includes': 'error', // Disabled - requires type info
      // '@typescript-eslint/prefer-string-starts-ends-with': 'error', // Disabled - requires type info

      // Naming conventions - simplified for better performance
      // '@typescript-eslint/naming-convention': [
      //   'error',
      //   {
      //     selector: 'variableLike',
      //     format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
      //     leadingUnderscore: 'allow',
      //   },
      //   {
      //     selector: 'typeLike',
      //     format: ['PascalCase'],
      //   },
      //   {
      //     selector: 'enumMember',
      //     format: ['UPPER_CASE', 'PascalCase'],
      //   },
      // ],
    },
  },
  {
    plugins: {
      onlyWarn,
    },
  },
  {
    ignores: [
      'dist/**',
      '.next/**',
      'build/**',
      'coverage/**',
      '**/*.generated.*',
      '**/node_modules/**',
      '.eslintcache',
      '**/.cache/**',
      '**/public/**',
      '**/*.min.js',
      '**/*.config.js',
      '**/vendor/**',
      '**/.git/**',
    ],
  },
];
