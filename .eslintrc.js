module.exports = {
    extends: [
      'react-app',
      'react-app/jest'
    ],
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'jsx-a11y/anchor-is-valid': 'error',
      'no-mixed-operators': 'error'
    }
  };