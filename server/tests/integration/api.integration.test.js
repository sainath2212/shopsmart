/**
 * INTEGRATION TESTS – Express app via Supertest
 *
 * Supertest wires up the full Express middleware stack in-process
 * (no real TCP port opened). Tests every registered route end-to-end
 * through the actual middleware chain.
 */

const request = require('supertest');
const app     = require('../../src/app');

describe('[Integration] GET /api/health', () => {
  it('responds with HTTP 200', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
  });

  it('Content-Type is application/json', async () => {
    const res = await request(app).get('/api/health');
    expect(res.headers['content-type']).toMatch(/application\/json/);
  });

  it('body has status "ok"', async () => {
    const res = await request(app).get('/api/health');
    expect(res.body).toHaveProperty('status', 'ok');
  });

  it('body has message field', async () => {
    const res = await request(app).get('/api/health');
    expect(res.body).toHaveProperty('message');
    expect(typeof res.body.message).toBe('string');
  });

  it('body has a valid ISO timestamp', async () => {
    const res = await request(app).get('/api/health');
    expect(res.body).toHaveProperty('timestamp');
    const date = new Date(res.body.timestamp);
    expect(date.toString()).not.toBe('Invalid Date');
  });
});

describe('[Integration] GET /', () => {
  it('responds with HTTP 200', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
  });

  it('body contains ShopSmart', async () => {
    const res = await request(app).get('/');
    expect(res.text).toMatch(/ShopSmart/i);
  });
});

describe('[Integration] GET /api-docs.json', () => {
  it('responds with HTTP 200', async () => {
    const res = await request(app).get('/api-docs.json');
    expect(res.statusCode).toBe(200);
  });

  it('returns a valid OpenAPI 3.0 spec', async () => {
    const res = await request(app).get('/api-docs.json');
    expect(res.body).toHaveProperty('openapi', '3.0.0');
    expect(res.body).toHaveProperty('info');
    expect(res.body).toHaveProperty('paths');
  });
});

describe('[Integration] 404 – unknown route', () => {
  it('returns 404 for /api/unknown', async () => {
    const res = await request(app).get('/api/unknown');
    expect(res.statusCode).toBe(404);
  });
});
