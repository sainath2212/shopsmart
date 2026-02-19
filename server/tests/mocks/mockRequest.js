/**
 * Mock factory for Express request objects.
 * Pass field overrides to simulate any request shape.
 *
 * @param {object} overrides
 * @returns {object} mock request
 */
const mockRequest = (overrides = {}) => ({
  body: {},
  params: {},
  query: {},
  headers: {},
  method: 'GET',
  url: '/',
  ...overrides,
});

module.exports = { mockRequest };
