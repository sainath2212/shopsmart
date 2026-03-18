const express = require('express');

const router = express.Router();

// ─── Categories ─────────────────────────────────────────────────────────────
const categories = [
  { id: 'electronics', name: 'Electronics', icon: '🔌', description: 'Gadgets, audio, and smart devices' },
  { id: 'clothing', name: 'Clothing', icon: '👕', description: 'Apparel, shoes, and activewear' },
  { id: 'accessories', name: 'Accessories', icon: '⌚', description: 'Watches, bags, and more' },
];

/**
 * Pure handler – get all categories
 */
const getCategoriesHandler = (_req, res) => {
  res.json({ categories });
};

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all product categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: A list of product categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       icon:
 *                         type: string
 *                       description:
 *                         type: string
 */
router.get('/categories', getCategoriesHandler);

module.exports = { router, categories, getCategoriesHandler };
