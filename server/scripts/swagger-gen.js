/**
 * swagger-gen.js – generates openapi.json without starting a server.
 * Called by `npm run swagger-gen` in CI.
 */

const swaggerJsdoc = require('swagger-jsdoc');
const fs           = require('fs');
const path         = require('path');

const options = {
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
  apis: [path.join(__dirname, '../src/routes/*.js')],
};

const spec     = swaggerJsdoc(options);
const outFile  = path.join(__dirname, '../openapi.json');

fs.writeFileSync(outFile, JSON.stringify(spec, null, 2), 'utf8');
console.log(`OpenAPI spec written to ${outFile}`);
