/**
 * E2E TESTS – real HTTP server on a live TCP port
 *
 * The actual Node.js server is started before the suite, a real fetch
 * call is made over localhost, and the server is shut down after.
 */

const http = require('http');
const app = require('../../src/app');
const { resetCart } = require('../../src/routes/cart');

const TEST_PORT = 5099;
let server;
let baseUrl;

// ─── Helpers ────────────────────────────────────────────────────────────────
const makeRequest = (method, path, body = null) =>
  new Promise((resolve, reject) => {
    const url = new URL(`${baseUrl}${path}`);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: { 'Content-Type': 'application/json' },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, body: data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });

const get = (path) => makeRequest('GET', path);
const post = (path, body) => makeRequest('POST', path, body);
const put = (path, body) => makeRequest('PUT', path, body);
const del = (path) => makeRequest('DELETE', path);
// ────────────────────────────────────────────────────────────────────────────

beforeAll((done) => {
  server = http.createServer(app);
  server.listen(TEST_PORT, () => {
    baseUrl = `http://localhost:${TEST_PORT}`;
    done();
  });
});

afterAll((done) => {
  server.close(done);
});

beforeEach(() => {
  resetCart();
});

describe('[E2E] Health endpoint over real TCP', () => {
  it('GET /api/health returns 200', async () => {
    const { status } = await get('/api/health');
    expect(status).toBe(200);
  });

  it('response body has status "ok"', async () => {
    const { body } = await get('/api/health');
    expect(body.status).toBe('ok');
  });

  it('response body has message and timestamp', async () => {
    const { body } = await get('/api/health');
    expect(typeof body.message).toBe('string');
    expect(typeof body.timestamp).toBe('string');
  });

  it('Content-Type header is JSON', async () => {
    const { headers } = await get('/api/health');
    expect(headers['content-type']).toMatch(/application\/json/);
  });
});

describe('[E2E] Products endpoint over real TCP', () => {
  it('GET /api/products returns 200 with products', async () => {
    const { status, body } = await get('/api/products');
    expect(status).toBe(200);
    expect(body.products.length).toBeGreaterThan(0);
  });

  it('GET /api/products?category=electronics filters correctly', async () => {
    const { body } = await get('/api/products?category=electronics');
    body.products.forEach((p) => {
      expect(p.category).toBe('electronics');
    });
  });

  it('GET /api/products/1 returns product details', async () => {
    const { status, body } = await get('/api/products/1');
    expect(status).toBe(200);
    expect(body.id).toBe(1);
  });

  it('GET /api/products/9999 returns 404', async () => {
    const { status } = await get('/api/products/9999');
    expect(status).toBe(404);
  });
});

describe('[E2E] Categories endpoint over real TCP', () => {
  it('GET /api/categories returns categories', async () => {
    const { status, body } = await get('/api/categories');
    expect(status).toBe(200);
    expect(body.categories.length).toBeGreaterThan(0);
  });
});

describe('[E2E] Cart full flow over real TCP', () => {
  it('add → get → update → remove', async () => {
    // Add item
    const addRes = await post('/api/cart', {
      productId: 1,
      name: 'E2E Item',
      price: 49.99,
      quantity: 2,
    });
    expect(addRes.status).toBe(201);

    // Get cart
    const getRes = await get('/api/cart');
    expect(getRes.body.itemCount).toBe(2);
    expect(getRes.body.subtotal).toBeCloseTo(99.98, 2);

    // Update quantity
    const updateRes = await put('/api/cart/1', { quantity: 3 });
    expect(updateRes.status).toBe(200);

    // Remove item
    const delRes = await del('/api/cart/1');
    expect(delRes.status).toBe(200);
    expect(delRes.body.cart.length).toBe(0);
  });
});

describe('[E2E] Root endpoint over real TCP', () => {
  it('GET / returns 200', async () => {
    const { status } = await get('/');
    expect(status).toBe(200);
  });
});

describe('[E2E] Swagger spec over real TCP', () => {
  it('GET /api-docs.json returns valid OpenAPI spec', async () => {
    const { status, body } = await get('/api-docs.json');
    expect(status).toBe(200);
    expect(body.openapi).toBe('3.0.0');
  });
});
