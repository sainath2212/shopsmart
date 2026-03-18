/**
 * UNIT TESTS – products route handler
 *
 * The handler is called directly with mock req/res objects.
 * No Express app, no HTTP server – pure function-level isolation.
 */

const { getProductsHandler, getProductByIdHandler, products } = require('../../src/routes/products');
const { mockRequest } = require('../mocks/mockRequest');
const { mockResponse } = require('../mocks/mockResponse');

describe('[Unit] getProductsHandler', () => {
  let req, res;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
  });

  it('calls res.json exactly once', () => {
    getProductsHandler(req, res);
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  it('returns all products when no filters applied', () => {
    getProductsHandler(req, res);
    const [payload] = res.json.mock.calls[0];
    expect(payload.products.length).toBe(products.length);
    expect(payload.total).toBe(products.length);
  });

  it('filters by category', () => {
    req.query = { category: 'electronics' };
    getProductsHandler(req, res);
    const [payload] = res.json.mock.calls[0];
    payload.products.forEach((p) => {
      expect(p.category).toBe('electronics');
    });
  });

  it('returns all products when category is "all"', () => {
    req.query = { category: 'all' };
    getProductsHandler(req, res);
    const [payload] = res.json.mock.calls[0];
    expect(payload.total).toBe(products.length);
  });

  it('filters by search term', () => {
    req.query = { search: 'headphones' };
    getProductsHandler(req, res);
    const [payload] = res.json.mock.calls[0];
    expect(payload.total).toBeGreaterThan(0);
    payload.products.forEach((p) => {
      const match =
        p.name.toLowerCase().includes('headphones') ||
        p.description.toLowerCase().includes('headphones');
      expect(match).toBe(true);
    });
  });

  it('sorts by price ascending', () => {
    req.query = { sort: 'price-asc' };
    getProductsHandler(req, res);
    const [payload] = res.json.mock.calls[0];
    for (let i = 1; i < payload.products.length; i++) {
      expect(payload.products[i].price).toBeGreaterThanOrEqual(payload.products[i - 1].price);
    }
  });

  it('sorts by price descending', () => {
    req.query = { sort: 'price-desc' };
    getProductsHandler(req, res);
    const [payload] = res.json.mock.calls[0];
    for (let i = 1; i < payload.products.length; i++) {
      expect(payload.products[i].price).toBeLessThanOrEqual(payload.products[i - 1].price);
    }
  });

  it('sorts by rating', () => {
    req.query = { sort: 'rating' };
    getProductsHandler(req, res);
    const [payload] = res.json.mock.calls[0];
    for (let i = 1; i < payload.products.length; i++) {
      expect(payload.products[i].rating).toBeLessThanOrEqual(payload.products[i - 1].rating);
    }
  });

  it('filters by price range', () => {
    req.query = { minPrice: '50', maxPrice: '150' };
    getProductsHandler(req, res);
    const [payload] = res.json.mock.calls[0];
    payload.products.forEach((p) => {
      expect(p.price).toBeGreaterThanOrEqual(50);
      expect(p.price).toBeLessThanOrEqual(150);
    });
  });
});

describe('[Unit] getProductByIdHandler', () => {
  let req, res;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
  });

  it('returns product for valid ID', () => {
    req.params = { id: '1' };
    getProductByIdHandler(req, res);
    const [payload] = res.json.mock.calls[0];
    expect(payload.id).toBe(1);
    expect(payload.name).toBeDefined();
  });

  it('returns 404 for unknown ID', () => {
    req.params = { id: '9999' };
    getProductByIdHandler(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});
