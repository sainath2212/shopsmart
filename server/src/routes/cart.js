const express = require('express');

const router = express.Router();

// ─── In-Memory Cart Store ───────────────────────────────────────────────────
// In production this would be per-user via sessions/JWT; here we use a single shared cart.
let cart = [];

/**
 * Pure handler – get all cart items
 */
const getCartHandler = (_req, res) => {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  res.json({
    items: cart,
    itemCount: cart.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: Math.round(subtotal * 100) / 100,
  });
};

/**
 * Pure handler – add item to cart
 */
const addToCartHandler = (req, res) => {
  const { productId, name, price, image, quantity = 1 } = req.body;

  if (!productId || !name || price == null) {
    return res.status(400).json({ error: 'productId, name, and price are required' });
  }

  const existing = cart.find((item) => item.productId === productId);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ productId, name, price, image, quantity });
  }

  res.status(201).json({ message: 'Item added to cart', cart });
};

/**
 * Pure handler – update cart item quantity
 */
const updateCartHandler = (req, res) => {
  const productId = parseInt(req.params.productId, 10);
  const { quantity } = req.body;

  const item = cart.find((i) => i.productId === productId);

  if (!item) {
    return res.status(404).json({ error: 'Item not found in cart' });
  }

  if (quantity <= 0) {
    cart = cart.filter((i) => i.productId !== productId);
    return res.json({ message: 'Item removed from cart', cart });
  }

  item.quantity = quantity;
  res.json({ message: 'Cart updated', cart });
};

/**
 * Pure handler – remove item from cart
 */
const removeFromCartHandler = (req, res) => {
  const productId = parseInt(req.params.productId, 10);
  const existed = cart.some((i) => i.productId === productId);

  if (!existed) {
    return res.status(404).json({ error: 'Item not found in cart' });
  }

  cart = cart.filter((i) => i.productId !== productId);
  res.json({ message: 'Item removed from cart', cart });
};

/**
 * Pure handler – clear entire cart
 */
const clearCartHandler = (_req, res) => {
  cart = [];
  res.json({ message: 'Cart cleared', cart: [] });
};

// Helper for tests to reset cart state
const resetCart = () => {
  cart = [];
};

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get cart contents
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Cart items with totals
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId, name, price]
 *             properties:
 *               productId:
 *                 type: integer
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               image:
 *                 type: string
 *               quantity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Item added
 *       400:
 *         description: Missing required fields
 *   delete:
 *     summary: Clear the entire cart
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Cart cleared
 */
router.get('/cart', getCartHandler);
router.post('/cart', addToCartHandler);
router.delete('/cart', clearCartHandler);

/**
 * @swagger
 * /api/cart/{productId}:
 *   put:
 *     summary: Update cart item quantity
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Cart updated
 *       404:
 *         description: Item not found in cart
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Item removed
 *       404:
 *         description: Item not found
 */
router.put('/cart/:productId', updateCartHandler);
router.delete('/cart/:productId', removeFromCartHandler);

module.exports = {
  router,
  getCartHandler,
  addToCartHandler,
  updateCartHandler,
  removeFromCartHandler,
  clearCartHandler,
  resetCart,
};
