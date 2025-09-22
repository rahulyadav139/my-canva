import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginReact from 'eslint-plugin-react';
import globals from 'globals';
import pluginNext from '@next/eslint-plugin-next';
import { config as baseConfig } from './base.js';

/**
 * A custom ESLint configuration for libraries that use Next.js.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const nextJsConfig = [
  // Base config already includes js.configs.recommended, eslintConfigPrettier, and tseslint.configs.recommended
  ...baseConfig,
  {
    ...pluginReact.configs.flat.recommended,
    languageOptions: {
      ...pluginReact.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
      },
    },
  },
  {
    plugins: {
      '@next/next': pluginNext,
    },
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs['core-web-vitals'].rules,
    },
  },
  {
    plugins: {
      'react-hooks': pluginReactHooks,
    },
    settings: { react: { version: 'detect' } },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      // React scope no longer necessary with new JSX transform.
      'react/react-in-jsx-scope': 'off',

      // ============= REACT SPECIFIC RULES =============
      // Component and JSX best practices
      'react/self-closing-comp': 'error',
      'react/jsx-boolean-value': ['error', 'never'],
      'react/jsx-curly-brace-presence': [
        'error',
        { props: 'never', children: 'never' },
      ],
      'react/jsx-fragments': ['error', 'syntax'],
      'react/jsx-no-useless-fragment': 'error',
      'react/jsx-pascal-case': 'error',
      'react/no-array-index-key': 'warn',
      'react/no-unstable-nested-components': 'error',
      'react/prefer-stateless-function': 'error',
      'react/function-component-definition': 'off',
      // 'react/function-component-definition': [
      //   'error',
      //   {
      //     namedComponents: 'arrow-function',
      //     unnamedComponents: 'arrow-function',
      //   },
      // ],

      // Props and state - optimized for performance
      // 'react/destructuring-assignment': ['error', 'always'], // Can be expensive
      // 'react/no-unused-prop-types': 'error', // Expensive rule, TypeScript handles this
      'react/require-default-props': 'off', // Not needed with TypeScript
      'react/default-props-match-prop-types': 'off', // Not needed with TypeScript
      'react/prop-types': 'off', // Not needed with TypeScript

      'react/jsx-no-bind': 'off',
      // Performance and memory leaks
      // 'react/jsx-no-bind': [
      //   'error',
      //   {
      //     ignoreDOMComponents: true,
      //     ignoreRefs: true,
      //     allowArrowFunctions: false,
      //     allowFunctions: false,
      //     allowBind: false,
      //   },
      // ],

      // Security
      'react/jsx-no-script-url': 'error',
      'react/jsx-no-target-blank': 'error',

      // Hooks
      'react-hooks/exhaustive-deps': 'error',

      // ============= NEXT.JS SPECIFIC RULES =============
      '@next/next/no-img-element': 'error',
      '@next/next/no-html-link-for-pages': 'error',
      '@next/next/no-head-element': 'error',
      '@next/next/no-title-in-document-head': 'error',
      '@next/next/no-unwanted-polyfillio': 'error',
      '@next/next/no-page-custom-font': 'error',
      '@next/next/no-css-tags': 'error',
      '@next/next/no-sync-scripts': 'error',
      '@next/next/no-document-import-in-page': 'error',
      '@next/next/no-head-import-in-document': 'error',
      '@next/next/no-script-component-in-head': 'error',
      '@next/next/no-styled-jsx-in-document': 'error',
    },
  },
];
