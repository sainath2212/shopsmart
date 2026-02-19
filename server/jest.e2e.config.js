/** Jest config – E2E tests only (real TCP server, higher timeout) */
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/e2e/**/*.test.js'],
  testTimeout: 30000,
  verbose: true,
};
