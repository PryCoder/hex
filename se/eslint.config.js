export default [
  {
    files: ['**/*.js'], // only checks JS files
    rules: {
      semi: 'error', // force semicolon
      'no-unused-vars': 'warn', // warn for unused variables
    },
  },
];
