/**
 * UNIT TESTS – categories route handler
 */

const { getCategoriesHandler, categories } = require('../../src/routes/categories');
const { mockRequest } = require('../mocks/mockRequest');
const { mockResponse } = require('../mocks/mockResponse');

describe('[Unit] getCategoriesHandler', () => {
  let req, res;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
  });

  it('calls res.json exactly once', () => {
    getCategoriesHandler(req, res);
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  it('returns all categories', () => {
    getCategoriesHandler(req, res);
    const [payload] = res.json.mock.calls[0];
    expect(payload.categories.length).toBe(categories.length);
  });

  it('each category has id, name, icon, and description', () => {
    getCategoriesHandler(req, res);
    const [payload] = res.json.mock.calls[0];
    payload.categories.forEach((cat) => {
      expect(cat).toHaveProperty('id');
      expect(cat).toHaveProperty('name');
      expect(cat).toHaveProperty('icon');
      expect(cat).toHaveProperty('description');
    });
  });
});
