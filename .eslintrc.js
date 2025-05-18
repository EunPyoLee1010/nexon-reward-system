module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
      project: './tsconfig.json',
      tsconfigRootDir: __dirname,
      sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  root: true,
  env: {
      node: true,
      jest: true,
  },
  ignorePatterns: ['**/node_modules'],
  rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-types': 'off',
      'prefer-rest-params': 'off',
      '@typescript-eslint/ban-ts-ignore': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'prettier/prettier': [
          'error',
          {
              singleQuote: true,
              tabWidth: 4,
              useTabs: false,
              endOfLine: 'auto',
              bracketSpacing: true,
          },
      ],
      '@typescript-eslint/no-floating-promises': 'error',
      'no-var': 0,
      '@typescript-eslint/no-empty-function': 0,
      '@typescript-eslint/ban-ts-comment': 0,
  }
};