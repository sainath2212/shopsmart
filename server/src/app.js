const express = require('express');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const { router: healthRouter } = require('./routes/health');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ─── Swagger / OpenAPI ──────────────────────────────────────────────────────
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ShopSmart API',
      version: '1.0.0',
      description: 'OpenAPI documentation for the ShopSmart backend',
    },
    servers: [
      { url: 'http://localhost:5001', description: 'Local development' },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Raw JSON spec endpoint (used by CI swagger-gen step)
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json(swaggerSpec);
});
// ────────────────────────────────────────────────────────────────────────────

// Routes
app.use('/api', healthRouter);

/**
 * @swagger
 * /:
 *   get:
 *     summary: Root
 *     description: Root endpoint confirming the service is reachable.
 *     tags:
 *       - General
 *     responses:
 *       200:
 *         description: Plain text confirmation
 */
app.get('/', (req, res) => {
  res.send('ShopSmart Backend Service');
});

module.exports = app;
module.exports.swaggerSpec = swaggerSpec;
