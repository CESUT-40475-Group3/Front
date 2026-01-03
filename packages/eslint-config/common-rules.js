module.exports = {
  indent: 'off',
  'no-alert': 'error',
  'no-console': 'error',
  'no-array-constructor': 'error',
  'import/no-default-export': 'off',
  'no-useless-constructor': 'warn',
  'unused-imports/no-unused-imports': 'error',
  'react/prop-types': 0,
  'no-unneeded-ternary': 'warn',
  'no-var': 'warn',
  'no-use-before-define': 'off',
  'no-undef': 'warn',
  quotes: ['warn', 'single', { allowTemplateLiterals: true }],
  'prefer-const': 'error',
  '@typescript-eslint/no-var-requires': 'off',
  '@typescript-eslint/no-explicit-any': 'off',

  '@typescript-eslint/no-unused-vars': [
    'error',
    {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      caughtErrorsIgnorePattern: '^_',
    },
  ],
  'import/no-anonymous-default-export': 'off',
  'sort-imports': 'off',
  'import/no-named-as-default-member': 'off',
  'import/no-named-as-default': 'off',
  'import/order': [
    'error',
    {
      'newlines-between': 'always',
      groups: ['type', 'builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object'],
      pathGroups: [
        {
          pattern: '@/*',
          group: 'internal',
        },
        {
          pattern: 'assets/*',
          group: 'internal',
        },
      ],
    },
  ],
  '@typescript-eslint/naming-convention': [
    'off',
    {
      selector: ['variable', 'classProperty'],
      format: ['camelCase'],
      filter: {
        regex: '(__meta|_id)',
        match: true,
      },
    },
  ],
  'prettier/prettier': [
    'error',
    {
      trailingComma: 'es5',
      singleQuote: true,
      tabWidth: 2,
      arrowParens: 'avoid',
      endOfLine: 'lf',
      bracketSameLine: false,
      bracketSpacing: true,
      quoteProps: 'as-needed',
      printWidth: 120,
      semi: false,
      singleAttributePerLine: true,
      jsxBracketSameLine: false,
      jsxSingleQuote: true,
    },
  ],
}
