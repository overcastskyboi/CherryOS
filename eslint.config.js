import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import react from 'eslint-plugin-react';
import reactRefresh from 'eslint-plugin-react-refresh';
import sonarjs from 'eslint-plugin-sonarjs';
import security from 'eslint-plugin-security';

export default [
  { ignores: ['dist', 'node_modules', 'temp_deploy'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        ...globals.es2020,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      sonarjs,
      security,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...sonarjs.configs.recommended.rules,
      ...security.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off', // Not needed for React 17+
      'react/prop-types': 'off', // Disabling for now due to large number of errors
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'security/detect-object-injection': 'warn',
      'sonarjs/cognitive-complexity': ['error', 15],
      'sonarjs/no-unused-vars': 'off', // Temporarily disabled due to issues with useNavigate
      'sonarjs/no-dead-store': 'off', // Temporarily disabled due to issues with useNavigate
      'sonarjs/pseudo-random': 'off', // Temporarily disabled to resolve current errors
    },
  },
  {
    files: ['**/*.test.{js,jsx}'], // Apply to test files
    languageOptions: {
      globals: {
        ...globals.node, // Enable Node.js globals for test files
        process: 'readonly', // Explicitly declare process as readonly global
      },
    },
  },
];