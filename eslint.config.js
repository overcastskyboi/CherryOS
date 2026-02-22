import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import security from 'eslint-plugin-security';
import sonarjs from 'eslint-plugin-sonarjs';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        console: 'readonly',
        process: 'readonly',
      },
    },
    plugins: {
      react: react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      security: security,
      sonarjs: sonarjs,
    },
    rules: {
      'react/react-in-jsx-scope': 0,
      'react-hooks/rules-of-hooks': 2,
      'react-hooks/exhaustive-deps': 2,
      'react-refresh/only-export-components': 2,
      'security/detect-object-injection': 2,
      'sonarjs/no-duplicate-string': 2,
    },
  },
];