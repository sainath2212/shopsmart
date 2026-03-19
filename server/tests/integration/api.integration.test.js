/**
 * INTEGRATION TESTS – Products & Categories & Cart via Supertest
 *
 * Supertest wires up the full Express middleware stack in-process
 * (no real TCP port opened).
 */

const request = require('supertest');
const app = require('../../src/app');
const { resetCart } = require('../../src/routes/cart');

// Reset cart before each test to ensure isolation
beforeEach(() => {
  resetCart();
});

// ─── Products ───────────────────────────────────────────────────────────────
describe('[Integration] GET /api/products', () => {
  it('responds with HTTP 200', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
  });

  it('returns products array and total count', async () => {
    const res = await request(app).get('/api/products');
    expect(res.body).toHaveProperty('products');
    expect(res.body).toHaveProperty('total');
    expect(Array.isArray(res.body.products)).toBe(true);
    expect(res.body.total).toBeGreaterThan(0);
  });

  it('filters by category', async () => {
    const res = await request(app).get('/api/products?category=electronics');
    res.body.products.forEach((p) => {
      expect(p.category).toBe('electronics');
    });
  });

  it('searches by name', async () => {
    const res = await request(app).get('/api/products?search=headphones');
    expect(res.body.total).toBeGreaterThan(0);
  });

  it('sorts by price ascending', async () => {
    const res = await request(app).get('/api/products?sort=price-asc');
    const prices = res.body.products.map((p) => p.price);
    for (let i = 1; i < prices.length; i++) {
      expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
    }
  });
});

describe('[Integration] GET /api/products/:id', () => {
  it('returns product for valid ID', async () => {
    const res = await request(app).get('/api/products/1');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', 1);
    expect(res.body).toHaveProperty('name');
  });

  it('returns 404 for non-existent ID', async () => {
    const res = await request(app).get('/api/products/9999');
    expect(res.statusCode).toBe(404);
  });
});

// ─── Categories ─────────────────────────────────────────────────────────────
describe('[Integration] GET /api/categories', () => {
  it('responds with HTTP 200', async () => {
    const res = await request(app).get('/api/categories');
    expect(res.statusCode).toBe(200);
  });

  it('returns categories array', async () => {
    const res = await request(app).get('/api/categories');
    expect(res.body).toHaveProperty('categories');
    expect(Array.isArray(res.body.categories)).toBe(true);
    expect(res.body.categories.length).toBeGreaterThan(0);
  });
});

// ─── Cart ───────────────────────────────────────────────────────────────────
describe('[Integration] Cart API', () => {
  it('GET /api/cart returns empty cart', async () => {
    const res = await request(app).get('/api/cart');
    expect(res.statusCode).toBe(200);
    expect(res.body.items).toEqual([]);
    expect(res.body.itemCount).toBe(0);
  });

  it('POST /api/cart adds item and returns 201', async () => {
    const res = await request(app)
      .post('/api/cart')
      .send({ productId: 1, name: 'Test Item', price: 29.99 });
    expect(res.statusCode).toBe(201);
    expect(res.body.cart.length).toBe(1);
  });

  it('POST /api/cart returns 400 for missing fields', async () => {
    const res = await request(app).post('/api/cart').send({ productId: 1 });
    expect(res.statusCode).toBe(400);
  });

  it('PUT /api/cart/:id updates quantity', async () => {
    await request(app)
      .post('/api/cart')
      .send({ productId: 1, name: 'Test', price: 10, quantity: 1 });

    const res = await request(app).put('/api/cart/1').send({ quantity: 5 });
    expect(res.statusCode).toBe(200);
    expect(res.body.cart[0].quantity).toBe(5);
  });

  it('DELETE /api/cart/:id removes item', async () => {
    await request(app).post('/api/cart').send({ productId: 1, name: 'Test', price: 10 });

    const res = await request(app).delete('/api/cart/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.cart.length).toBe(0);
  });

  it('DELETE /api/cart clears all items', async () => {
    await request(app).post('/api/cart').send({ productId: 1, name: 'Test', price: 10 });
    await request(app).post('/api/cart').send({ productId: 2, name: 'Test2', price: 20 });

    const res = await request(app).delete('/api/cart');
    expect(res.statusCode).toBe(200);
    expect(res.body.cart).toEqual([]);
  });

  it('full cart flow: add → get → update → delete', async () => {
    // Add
    await request(app)
      .post('/api/cart')
      .send({ productId: 1, name: 'Widget', price: 9.99, quantity: 2 });

    // Get
    let res = await request(app).get('/api/cart');
    expect(res.body.itemCount).toBe(2);
    expect(res.body.subtotal).toBeCloseTo(19.98, 2);

    // Update
    await request(app).put('/api/cart/1').send({ quantity: 5 });
    res = await request(app).get('/api/cart');
    expect(res.body.itemCount).toBe(5);

    // Delete
    await request(app).delete('/api/cart/1');
    res = await request(app).get('/api/cart');
    expect(res.body.itemCount).toBe(0);
  });
});
