/**
 * UNIT TESTS – cart route handlers
 *
 * Each handler is called directly with mock req/res objects.
 * Cart is reset between tests to ensure isolation.
 */

const {
  getCartHandler,
  addToCartHandler,
  updateCartHandler,
  removeFromCartHandler,
  clearCartHandler,
  resetCart,
} = require('../../src/routes/cart');
const { mockRequest } = require('../mocks/mockRequest');
const { mockResponse } = require('../mocks/mockResponse');

describe('[Unit] Cart handlers', () => {
  let req, res;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    resetCart();
  });

  describe('getCartHandler', () => {
    it('returns empty cart initially', () => {
      getCartHandler(req, res);
      const [payload] = res.json.mock.calls[0];
      expect(payload.items).toEqual([]);
      expect(payload.itemCount).toBe(0);
      expect(payload.subtotal).toBe(0);
    });
  });

  describe('addToCartHandler', () => {
    it('adds item to cart and returns 201', () => {
      req.body = { productId: 1, name: 'Test Item', price: 29.99, quantity: 1 };
      addToCartHandler(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('returns 400 when required fields missing', () => {
      req.body = { productId: 1 };
      addToCartHandler(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('increments quantity for duplicate productId', () => {
      req.body = { productId: 1, name: 'Test', price: 10, quantity: 1 };
      addToCartHandler(req, res);

      res = mockResponse();
      req.body = { productId: 1, name: 'Test', price: 10, quantity: 2 };
      addToCartHandler(req, res);

      const [payload] = res.json.mock.calls[0];
      const item = payload.cart.find((i) => i.productId === 1);
      expect(item.quantity).toBe(3);
    });
  });

  describe('updateCartHandler', () => {
    it('updates item quantity', () => {
      req.body = { productId: 1, name: 'Test', price: 10, quantity: 1 };
      addToCartHandler(req, res);

      req = mockRequest();
      res = mockResponse();
      req.params = { productId: '1' };
      req.body = { quantity: 5 };
      updateCartHandler(req, res);
      const [payload] = res.json.mock.calls[0];
      expect(payload.cart[0].quantity).toBe(5);
    });

    it('removes item when quantity is 0', () => {
      req.body = { productId: 1, name: 'Test', price: 10, quantity: 1 };
      addToCartHandler(req, res);

      req = mockRequest();
      res = mockResponse();
      req.params = { productId: '1' };
      req.body = { quantity: 0 };
      updateCartHandler(req, res);
      const [payload] = res.json.mock.calls[0];
      expect(payload.cart.length).toBe(0);
    });

    it('returns 404 for non-existent item', () => {
      req.params = { productId: '999' };
      req.body = { quantity: 1 };
      updateCartHandler(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('removeFromCartHandler', () => {
    it('removes existing item', () => {
      req.body = { productId: 1, name: 'Test', price: 10, quantity: 1 };
      addToCartHandler(req, res);

      req = mockRequest();
      res = mockResponse();
      req.params = { productId: '1' };
      removeFromCartHandler(req, res);
      const [payload] = res.json.mock.calls[0];
      expect(payload.cart.length).toBe(0);
    });

    it('returns 404 for non-existent item', () => {
      req.params = { productId: '999' };
      removeFromCartHandler(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('clearCartHandler', () => {
    it('empties the cart', () => {
      req.body = { productId: 1, name: 'Test', price: 10, quantity: 1 };
      addToCartHandler(req, res);

      req = mockRequest();
      res = mockResponse();
      clearCartHandler(req, res);
      const [payload] = res.json.mock.calls[0];
      expect(payload.cart).toEqual([]);
    });
  });
});
