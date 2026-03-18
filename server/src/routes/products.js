const express = require('express');

const router = express.Router();

// ─── In-Memory Product Store ────────────────────────────────────────────────
const products = [
  {
    id: 1,
    name: 'Wireless Noise-Cancelling Headphones',
    description: 'Premium over-ear headphones with active noise cancellation, 30hr battery life, and Hi-Res audio support.',
    price: 249.99,
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    rating: 4.8,
    reviews: 1247,
    inStock: true,
    badge: 'Best Seller',
  },
  {
    id: 2,
    name: 'Minimalist Leather Watch',
    description: 'Handcrafted genuine leather strap with sapphire crystal glass. Water resistant to 50m.',
    price: 189.00,
    category: 'accessories',
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400',
    rating: 4.6,
    reviews: 834,
    inStock: true,
    badge: 'New',
  },
  {
    id: 3,
    name: 'Organic Cotton Hoodie',
    description: '100% GOTS-certified organic cotton. Relaxed fit with kangaroo pocket. Available in 8 colors.',
    price: 79.99,
    category: 'clothing',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
    rating: 4.5,
    reviews: 2103,
    inStock: true,
    badge: null,
  },
  {
    id: 4,
    name: 'Smart Home Speaker',
    description: 'Voice-controlled speaker with premium 360° sound, smart home hub, and multi-room audio support.',
    price: 129.99,
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=400',
    rating: 4.7,
    reviews: 3421,
    inStock: true,
    badge: 'Popular',
  },
  {
    id: 5,
    name: 'Running Sneakers Pro',
    description: 'Ultra-lightweight with responsive foam cushioning. Breathable mesh upper for maximum comfort.',
    price: 159.99,
    category: 'clothing',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    rating: 4.9,
    reviews: 567,
    inStock: true,
    badge: 'Top Rated',
  },
  {
    id: 6,
    name: 'Stainless Steel Water Bottle',
    description: 'Triple-wall vacuum insulated. Keeps drinks cold 24hrs or hot 12hrs. BPA-free, 750ml capacity.',
    price: 34.99,
    category: 'accessories',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400',
    rating: 4.4,
    reviews: 1892,
    inStock: true,
    badge: null,
  },
  {
    id: 7,
    name: 'Mechanical Keyboard RGB',
    description: 'Cherry MX Brown switches, per-key RGB backlighting, aluminum frame. N-key rollover.',
    price: 149.99,
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400',
    rating: 4.7,
    reviews: 923,
    inStock: true,
    badge: null,
  },
  {
    id: 8,
    name: 'Canvas Backpack',
    description: 'Waxed canvas with leather trim. Padded 15" laptop compartment. Water-resistant coating.',
    price: 99.99,
    category: 'accessories',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    rating: 4.3,
    reviews: 445,
    inStock: false,
    badge: 'Sold Out',
  },
];

/**
 * Pure handler – get all products with optional filtering
 */
const getProductsHandler = (req, res) => {
  let result = [...products];
  const { category, search, sort, minPrice, maxPrice } = req.query;

  if (category && category !== 'all') {
    result = result.filter((p) => p.category === category);
  }

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
  }

  if (minPrice) {
    result = result.filter((p) => p.price >= parseFloat(minPrice));
  }

  if (maxPrice) {
    result = result.filter((p) => p.price <= parseFloat(maxPrice));
  }

  if (sort === 'price-asc') {
    result.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-desc') {
    result.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    result.sort((a, b) => b.rating - a.rating);
  } else if (sort === 'name') {
    result.sort((a, b) => a.name.localeCompare(b.name));
  }

  res.json({ products: result, total: result.length });
};

/**
 * Pure handler – get single product by ID
 */
const getProductByIdHandler = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const product = products.find((p) => p.id === id);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.json(product);
};

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     description: Returns a list of products with optional filtering, searching, and sorting.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category (electronics, clothing, accessories, all)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search products by name or description
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [price-asc, price-desc, rating, name]
 *         description: Sort order
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                 total:
 *                   type: integer
 */
router.get('/products', getProductsHandler);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     description: Returns a single product by its ID.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details
 *       404:
 *         description: Product not found
 */
router.get('/products/:id', getProductByIdHandler);

module.exports = { router, products, getProductsHandler, getProductByIdHandler };
