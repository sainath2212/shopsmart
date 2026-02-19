/** Root Jest config – runs ALL test suites (unit + integration + e2e). */
module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '**/tests/unit/**/*.test.js',
    '**/tests/integration/**/*.test.js',
    '**/tests/e2e/**/*.test.js',
    '**/tests/app.test.js',
  ],
  testTimeout: 15000,
  verbose: true,
  collectCoverage: false,
};
