/**
 * Mock factory for Express response objects.
 * Returned methods are Jest spies so tests can assert on them.
 *
 * @returns {object} mock response with jest.fn() spies
 */
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.setHeader = jest.fn().mockReturnValue(res);
  return res;
};

module.exports = { mockResponse };
