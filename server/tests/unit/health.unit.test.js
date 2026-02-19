/**
 * UNIT TESTS – health route handler
 *
 * The handler is called directly with mock req/res objects.
 * No Express app, no HTTP server – pure function-level isolation.
 */

const { healthHandler } = require('../../src/routes/health');
const { mockRequest }   = require('../mocks/mockRequest');
const { mockResponse }  = require('../mocks/mockResponse');

describe('[Unit] healthHandler', () => {
  let req, res;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('calls res.json exactly once', () => {
    healthHandler(req, res);
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  it('returns status "ok"', () => {
    healthHandler(req, res);
    const [payload] = res.json.mock.calls[0];
    expect(payload.status).toBe('ok');
  });

  it('returns the expected message', () => {
    healthHandler(req, res);
    const [payload] = res.json.mock.calls[0];
    expect(payload.message).toBe('ShopSmart Backend is running');
  });

  it('returns a valid ISO timestamp', () => {
    healthHandler(req, res);
    const [payload] = res.json.mock.calls[0];
    expect(() => new Date(payload.timestamp)).not.toThrow();
    expect(payload.timestamp).toBe('2024-01-01T00:00:00.000Z');
  });

  it('does not call res.status (defaults to 200)', () => {
    healthHandler(req, res);
    expect(res.status).not.toHaveBeenCalled();
  });
});
