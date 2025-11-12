import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cart, setCart] = useState([]);
  const [paymentInfo, setPaymentInfo] = useState(null);

  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`${API_BASE}/api/products`);
      setProducts(response.data);
    } catch (err) {
      // Fallback to demo data when backend is unavailable
      console.warn('Backend unavailable, using demo data:', err.message);
      const demoProducts = [
        {
          name: 'Ethiopian Yirgacheffe',
          price: 15.99,
          originalPrice: 15.23,
          image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=300&h=300&fit=crop'
        },
        {
          name: 'Colombian Medium Roast',
          price: 14.69,
          originalPrice: 14.00,
          image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b3f4?w=300&h=300&fit=crop'
        },
        {
          name: 'Brazilian Dark Roast',
          price: 13.99,
          originalPrice: 13.32,
          image: 'https://images.unsplash.com/photo-1541432557015-8c8ae8fce581?w=300&h=300&fit=crop'
        },
        {
          name: 'Indonesian Sumatra',
          price: 16.49,
          originalPrice: 15.71,
          image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&h=300&fit=crop'
        }
      ];
      setProducts(demoProducts);
      setError('');
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  const fetchPaymentInfo = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/payment-info`);
      setPaymentInfo(response.data);
    } catch (err) {
      // Fallback demo payment info
      console.warn('Could not fetch payment info, using demo:', err.message);
      setPaymentInfo({ venmoUsername: 'coffeegroupbuy' });
    }
  }, [API_BASE]);

  useEffect(() => {
    fetchProducts();
    fetchPaymentInfo();
  }, [fetchProducts, fetchPaymentInfo]);

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.name === product.name);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.name === product.name
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productName) => {
    setCart(cart.filter(item => item.name !== productName));
  };

  const updateQuantity = (productName, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productName);
    } else {
      setCart(cart.map(item =>
        item.name === productName
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  const handleRefresh = () => {
    fetchProducts();
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    const cartDetails = cart
      .map(item => `${item.name} x${item.quantity} @ $${item.price.toFixed(2)}`)
      .join('\n');
    
    const message = `Coffee Order Summary:\n${cartDetails}\n\nTotal: $${cartTotal.toFixed(2)}`;
    
    if (paymentInfo && paymentInfo.venmoUsername) {
      const venmoUrl = `https://venmo.com/${paymentInfo.venmoUsername}`;
      alert(`${message}\n\nClick OK to send payment via Venmo:\n${venmoUrl}`);
      window.open(venmoUrl, '_blank');
    } else {
      alert(message);
    }
  };

  return (
    <div className="App">
      <header>
        <h1>☕ Coffee Group Buy</h1>
        <p>Wholesale Coffee Club - Save Together, Brew Together</p>
      </header>

      <div className="container">
        {error && <div className="error">{error}</div>}

        <div className="controls">
          <h2>Available Products</h2>
          <button onClick={handleRefresh} disabled={loading}>
            {loading ? 'Loading...' : 'Refresh Products'}
          </button>
        </div>

        {loading && !products.length ? (
          <div className="loading">Loading coffee products...</div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <p>No products available. Please try refreshing.</p>
          </div>
        ) : (
          <>
            <div className="stats">
              <span>📦 {products.length} products available</span>
              <span>🎯 +5% markup applied</span>
            </div>

            <div className="products-grid">
              {products.map((product, idx) => (
                <div key={idx} className="product-card">
                  <div className="product-image">
                    {product.image ? (
                      <img src={product.image} alt={product.name} />
                    ) : (
                      '☕'
                    )}
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <div className="product-price">
                      {product.originalPrice && (
                        <span className="original-price">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                      <span className="current-price">
                        ${product.price.toFixed(2)}
                      </span>
                    </div>
                    <span className="markup-badge">+5% markup</span>
                    <button
                      className="add-to-cart"
                      onClick={() => addToCart(product)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {cart.length > 0 && (
          <div className="cart-summary">
            <h3>🛒 Your Cart ({cartItemCount} items)</h3>
            {cart.map((item, idx) => (
              <div key={idx}>
                <div className="cart-item">
                  <span>{item.name}</span>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <button
                      onClick={() => updateQuantity(item.name, item.quantity - 1)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '1rem'
                      }}
                    >
                      −
                    </button>
                    <span style={{ width: '2rem', textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.name, item.quantity + 1)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '1rem'
                      }}
                    >
                      +
                    </button>
                  </div>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                  <button
                    onClick={() => removeFromCart(item.name)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#D2691E'
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
            <div className="cart-total">
              Total: ${cartTotal.toFixed(2)}
            </div>
            <button
              className="add-to-cart"
              onClick={handleCheckout}
              style={{ marginTop: '1rem' }}
            >
              Proceed to Payment
            </button>
          </div>
        )}

        {paymentInfo && (
          <div className="payment-info">
            <h3>💳 Payment Information</h3>
            <div className="payment-details">
              <strong>Method:</strong> Venmo<br />
              <strong>Username:</strong> @{paymentInfo.venmoUsername}<br />
              <strong>Instructions:</strong> {paymentInfo.instructions}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
