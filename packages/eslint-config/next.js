const { resolve } = require('node:path')

const commonRules = require('./common-rules')

const project = resolve(process.cwd(), 'tsconfig.json')

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    'next',
    'eslint:recommended',
    require.resolve('@vercel/style-guide/eslint/next'),
    'turbo',
    'next/core-web-vitals',
    'plugin:import/recommended',
    './react-internal',
    'prettier',
  ],
  globals: {
    React: true,
    JSX: true,
  },
  env: {
    node: true,
    browser: true,
  },
  plugins: ['only-warn', 'unused-imports', '@typescript-eslint', 'import', 'prettier'],
  settings: {
    'import/resolver': {
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: [
    // Ignore dotfiles
    '.*.js',
    'node_modules/',
    'dist/',
    '/public/**',
  ],
  overrides: [
    {
      files: ['*.js?(x)', '*.ts?(x)'],
    },
  ],
  rules: {
    ...commonRules,
  },
}
