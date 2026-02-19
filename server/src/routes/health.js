const express = require('express');

const router = express.Router();

/**
 * Pure handler – extracted so unit tests can call it directly with mock req/res.
 */
const healthHandler = (req, res) => {
  res.json({
    status: 'ok',
    message: 'ShopSmart Backend is running',
    timestamp: new Date().toISOString(),
  });
};

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check
 *     description: Returns the current status of the ShopSmart backend service.
 *     tags:
 *       - Monitoring
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 message:
 *                   type: string
 *                   example: ShopSmart Backend is running
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
router.get('/health', healthHandler);

module.exports = { router, healthHandler };
