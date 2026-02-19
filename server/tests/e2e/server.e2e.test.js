/**
 * E2E TESTS – real HTTP server on a live TCP port
 *
 * The actual Node.js server is started before the suite, a real fetch
 * call is made over localhost, and the server is shut down after.
 * This mirrors what a real client would experience in production.
 */

const http     = require('http');
const app      = require('../../src/app');

const TEST_PORT = 5099;
let server;
let baseUrl;

// ─── Helpers ────────────────────────────────────────────────────────────────
const get = (path) =>
  new Promise((resolve, reject) => {
    http.get(`${baseUrl}${path}`, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, body: data });
        }
      });
    }).on('error', reject);
  });
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
