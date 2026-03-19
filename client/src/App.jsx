import { useState, useEffect, useCallback } from 'react';

/* ─── API Helper ─────────────────────────────────────────────────────────── */
const API = import.meta.env.VITE_API_URL || '';

/* ─── Navbar Component ───────────────────────────────────────────────────── */
function Navbar({ cartCount, onCartClick }) {
  return (
    <nav className="navbar" id="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand">
          <span className="logo-icon">🛍️</span>
          <span>
            Shop<span className="brand-accent">Smart</span>
          </span>
        </div>
        <div className="navbar-actions">
          <button
            className="cart-btn"
            onClick={onCartClick}
            id="cart-button"
            aria-label="Open cart"
          >
            <span className="cart-icon">🛒</span>
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="cart-badge" id="cart-count">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}

/* ─── Product Card Component ─────────────────────────────────────────────── */
function ProductCard({ product, onAddToCart }) {
  const getBadgeClass = (badge) => {
    if (!badge) return '';
    const map = {
      'Best Seller': 'badge-best-seller',
      New: 'badge-new',
      Popular: 'badge-popular',
      'Top Rated': 'badge-top-rated',
      'Sold Out': 'badge-sold-out',
    };
    return map[badge] || '';
  };

  const renderStars = (rating) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - half);
  };

  return (
    <div className="product-card" id={`product-${product.id}`}>
      <div className="product-card-image">
        <img src={product.image} alt={product.name} loading="lazy" />
        {product.badge && (
          <span className={`product-badge ${getBadgeClass(product.badge)}`}>{product.badge}</span>
        )}
      </div>
      <div className="product-card-body">
        <span className="product-category-tag">{product.category}</span>
        <h3>{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-rating">
          <span className="stars">{renderStars(product.rating)}</span>
          <span className="rating-number">{product.rating}</span>
          <span className="review-count">({product.reviews.toLocaleString()})</span>
        </div>
        <div className="product-card-footer">
          <span className="product-price">
            <span className="currency">$</span>
            {product.price.toFixed(2)}
          </span>
          <button
            className="add-to-cart-btn"
            onClick={() => onAddToCart(product)}
            disabled={!product.inStock}
            id={`add-to-cart-${product.id}`}
            aria-label={`Add ${product.name} to cart`}
          >
            {product.inStock ? '+ Add' : 'Sold Out'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Skeleton Loader ────────────────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-image" />
      <div className="skeleton-body">
        <div className="skeleton skeleton-line short" />
        <div className="skeleton skeleton-line wide" />
        <div className="skeleton skeleton-line medium" />
        <div className="skeleton skeleton-line short" />
      </div>
    </div>
  );
}

/* ─── Cart Drawer Component ──────────────────────────────────────────────── */
function CartDrawer({ isOpen, onClose, cart, onUpdate, onRemove, onClear }) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <div className={`cart-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} id="cart-overlay" />
      <div
        className={`cart-drawer ${isOpen ? 'open' : ''}`}
        id="cart-drawer"
        role="dialog"
        aria-label="Shopping cart"
      >
        <div className="cart-header">
          <h2>🛒 Cart ({itemCount})</h2>
          <button
            className="close-cart-btn"
            onClick={onClose}
            id="close-cart"
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <div className="empty-icon">🛒</div>
              <p>Your cart is empty</p>
            </div>
          ) : (
            cart.map((item) => (
              <div className="cart-item" key={item.productId} id={`cart-item-${item.productId}`}>
                <div className="cart-item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="cart-item-details">
                  <h4>{item.name}</h4>
                  <div className="cart-item-price">${item.price.toFixed(2)}</div>
                  <div className="cart-item-controls">
                    <button
                      className="qty-btn"
                      onClick={() => onUpdate(item.productId, item.quantity - 1)}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="qty-value">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => onUpdate(item.productId, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  className="remove-item-btn"
                  onClick={() => onRemove(item.productId)}
                  aria-label={`Remove ${item.name} from cart`}
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Subtotal</span>
              <span className="total-price">${subtotal.toFixed(2)}</span>
            </div>
            <button className="checkout-btn" id="checkout-btn">
              Proceed to Checkout
            </button>
            <button className="clear-cart-btn" onClick={onClear} id="clear-cart">
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}

/* ─── Toast Component ────────────────────────────────────────────────────── */
function ToastContainer({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div className="toast" key={t.id}>
          <span className="toast-icon">✅</span>
          {t.message}
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Main App Component
   ═══════════════════════════════════════════════════════════════════════════ */
function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // ─── Fetch Products ────────────────────────────────────────────────────
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (activeCategory !== 'all') params.set('category', activeCategory);
      if (searchQuery) params.set('search', searchQuery);
      if (sortBy) params.set('sort', sortBy);

      const res = await fetch(`${API}/api/products?${params}`);
      const data = await res.json();
      setProducts(data.products);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, searchQuery, sortBy]);

  // ─── Fetch Categories ──────────────────────────────────────────────────
  useEffect(() => {
    fetch(`${API}/api/categories`)
      .then((r) => r.json())
      .then((d) => setCategories(d.categories))
      .catch((err) => console.error('Error fetching categories:', err));
  }, []);

  // ─── Fetch Cart ────────────────────────────────────────────────────────
  const fetchCart = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/cart`);
      const data = await res.json();
      setCart(data.items);
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // ─── Toast Helper ──────────────────────────────────────────────────────
  const showToast = (message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  // ─── Cart Actions ─────────────────────────────────────────────────────
  const addToCart = async (product) => {
    try {
      await fetch(`${API}/api/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
        }),
      });
      await fetchCart();
      showToast(`${product.name} added to cart`);
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };

  const updateCartItem = async (productId, quantity) => {
    try {
      if (quantity <= 0) {
        await fetch(`${API}/api/cart/${productId}`, { method: 'DELETE' });
      } else {
        await fetch(`${API}/api/cart/${productId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quantity }),
        });
      }
      await fetchCart();
    } catch (err) {
      console.error('Error updating cart:', err);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await fetch(`${API}/api/cart/${productId}`, { method: 'DELETE' });
      await fetchCart();
      showToast('Item removed from cart');
    } catch (err) {
      console.error('Error removing from cart:', err);
    }
  };

  const clearCart = async () => {
    try {
      await fetch(`${API}/api/cart`, { method: 'DELETE' });
      await fetchCart();
      showToast('Cart cleared');
    } catch (err) {
      console.error('Error clearing cart:', err);
    }
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <Navbar cartCount={cartCount} onCartClick={() => setCartOpen(true)} />

      {/* Hero */}
      <section className="hero" id="hero">
        <h1>
          Discover <span className="gradient-text">Premium</span> Product
        </h1>
        <p>Curated collection of the finest products, handpicked for quality and style.</p>
      </section>

      {/* Categories */}
      <div className="categories-bar" id="categories">
        <button
          className={`category-chip ${activeCategory === 'all' ? 'active' : ''}`}
          onClick={() => setActiveCategory('all')}
          id="category-all"
        >
          <span className="chip-icon">🏠</span> All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`category-chip ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
            id={`category-${cat.id}`}
          >
            <span className="chip-icon">{cat.icon}</span> {cat.name}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="toolbar" id="toolbar">
        <div className="toolbar-left">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="search-input"
              aria-label="Search products"
            />
          </div>
          <span className="product-count">
            <strong>{products.length}</strong> products
          </span>
        </div>
        <select
          className="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          id="sort-select"
          aria-label="Sort products"
        >
          <option value="">Sort by</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="rating">Top Rated</option>
          <option value="name">Name A→Z</option>
        </select>
      </div>

      {/* Product Grid */}
      <section className="products-section" id="products">
        <div className="product-grid">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : products.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
              ))}
        </div>
      </section>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onUpdate={updateCartItem}
        onRemove={removeFromCart}
        onClear={clearCart}
      />

      {/* Toasts */}
      <ToastContainer toasts={toasts} />

      {/* Footer */}
      <footer className="footer" id="footer">
        <div className="footer-links">
          <a href="#hero">Home</a>
          <a href="#products">Products</a>
          <a href="/api-docs" target="_blank" rel="noopener noreferrer">
            API Docs
          </a>
        </div>
        <p>© 2026 ShopSmart. All rights reserved.</p>
      </footer>
    </>
  );
}

export default App;
