const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { scrapeServeonyx } = require('./scrapers/serveonyx');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Cache for products
let productsCache = null;
let cacheTime = null;
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

// Route to get all coffee products
app.get('/api/products', async (req, res) => {
  try {
    // Check if cache is still valid
    const now = Date.now();
    if (productsCache && cacheTime && (now - cacheTime) < CACHE_DURATION) {
      return res.json(productsCache);
    }

    // Scrape fresh data
    const products = await scrapeServeonyx(
      process.env.SERVEONYX_EMAIL,
      process.env.SERVEONYX_PASSWORD
    );

    // Add 5% markup to prices
    const productsWithMarkup = products.map(product => ({
      ...product,
      originalPrice: product.price,
      markup: 0.05,
      price: parseFloat((product.price * 1.05).toFixed(2))
    }));

    // Update cache
    productsCache = productsWithMarkup;
    cacheTime = now;

    res.json(productsWithMarkup);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Route to refresh products
app.post('/api/products/refresh', async (req, res) => {
  try {
    const products = await scrapeServeonyx(
      process.env.SERVEONYX_EMAIL,
      process.env.SERVEONYX_PASSWORD
    );

    const productsWithMarkup = products.map(product => ({
      ...product,
      originalPrice: product.price,
      markup: 0.05,
      price: parseFloat((product.price * 1.05).toFixed(2))
    }));

    productsCache = productsWithMarkup;
    cacheTime = Date.now();

    res.json(productsWithMarkup);
  } catch (error) {
    console.error('Error refreshing products:', error);
    res.status(500).json({ error: 'Failed to refresh products' });
  }
});

// Route for payment info (Venmo)
app.get('/api/payment-info', (req, res) => {
  res.json({
    method: 'venmo',
    venmoUsername: process.env.VENMO_USERNAME || 'your-venmo-username',
    instructions: 'Send payment via Venmo to the username above. Please include order details in the memo.'
  });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
