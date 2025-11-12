# Testing & Development Guide

## Testing the Application Locally

### Prerequisites
- Node.js installed
- Both backend and frontend running
- Internet connection

### Frontend Testing

#### 1. Manual UI Testing

1. Navigate to `http://localhost:3000`
2. Verify page loads with coffee theme styling
3. Check that "Refresh Products" button is visible
4. Verify products load after clicking refresh

#### 2. Shopping Cart Testing

1. Click "Add to Cart" on any product
2. Verify product appears in cart sidebar
3. Adjust quantity using +/- buttons
4. Remove item using ✕ button
5. Verify total price updates correctly with 5% markup

#### 3. Checkout Testing

1. Add multiple items to cart
2. Click "Proceed to Payment"
3. Verify order summary displays
4. Verify Venmo link opens (if configured)

#### 4. Responsive Design Testing

Use Chrome DevTools (F12):
1. Toggle device toolbar (Ctrl+Shift+M)
2. Test on iPhone 12, iPad, and desktop sizes
3. Verify layout adapts properly

### Backend Testing

#### 1. Test API Endpoints

**Using cURL:**

```bash
# Get products
curl http://localhost:5000/api/products

# Refresh products
curl -X POST http://localhost:5000/api/products/refresh

# Get payment info
curl http://localhost:5000/api/payment-info
```

**Using REST Client Extension (VS Code):**

Create `test.rest` file:
```http
### Get Products
GET http://localhost:5000/api/products

### Refresh Products
POST http://localhost:5000/api/products/refresh

### Get Payment Info
GET http://localhost:5000/api/payment-info
```

Install "REST Client" extension and click "Send Request" above each endpoint.

#### 2. Test Web Scraping

Add debug logging to `backend/scrapers/serveonyx.js`:

```javascript
async function scrapeServeonyx(email, password) {
  // ... existing code ...
  
  console.log('Email:', email);
  console.log('Password:', password ? '****' : 'EMPTY');
  console.log('Found ' + products.length + ' products');
  
  products.forEach(p => {
    console.log(`${p.name}: $${p.price}`);
  });
  
  return products;
}
```

#### 3. Test Error Handling

**Test missing .env variables:**
1. Remove SERVEONYX_PASSWORD from `.env`
2. Try to fetch products
3. Verify error is logged

**Test invalid credentials:**
1. Set wrong password in `.env`
2. Try to fetch products
3. Should fail with timeout or 401 error

### Integration Testing

#### Test Complete Flow

1. **Start Backend:**
   ```bash
   cd backend
   npm start
   ```
   Verify: "Backend server running on port 5000"

2. **Start Frontend:**
   ```bash
   cd frontend
   npm start
   ```
   Verify: Browser opens to http://localhost:3000

3. **Load Products:**
   - Click "Refresh Products"
   - Wait for products to load
   - Verify product list displays

4. **Test Cart:**
   - Add 3 items with different quantities
   - Verify total = sum of (price × quantity)
   - Verify 5% markup is applied

5. **Test Checkout:**
   - Click "Proceed to Payment"
   - Verify order summary
   - Verify Venmo integration works

### Performance Testing

#### Measure Load Time

**Frontend:**
```javascript
// Open DevTools Console (F12)
performance.measure('pageLoad');
console.log(performance.getEntriesByName('pageLoad')[0].duration + 'ms');
```

**Backend:**
```bash
# Test API response time
time curl http://localhost:5000/api/products
```

#### Load Products Cache

1. First request (should take 5-10 seconds - scraping)
2. Second request within 1 hour (should be instant - cached)
3. Refresh products (should take 5-10 seconds - fresh scrape)

### Debugging

#### Frontend Debugging

**Open Browser DevTools:**
```
F12 or Ctrl+Shift+I (Windows/Linux)
Cmd+Option+I (Mac)
```

**Check Console Tab:**
- Look for JavaScript errors
- Verify network requests to backend
- Check CORS errors

**Check Network Tab:**
- Click on requests to see response data
- Verify API endpoints respond with 200 status
- Check response times

**Console Debugging:**
```javascript
// In browser console
// Check fetched products
fetch('http://localhost:5000/api/products')
  .then(r => r.json())
  .then(data => console.table(data));

// Check API working
fetch('http://localhost:5000/api/payment-info')
  .then(r => r.json())
  .then(data => console.log('Payment Info:', data));
```

#### Backend Debugging

**Monitor Logs:**
```bash
cd backend
npm start
# Watch for error messages
```

**Add Detailed Logging:**
Edit `backend/server.js`:
```javascript
app.get('/api/products', async (req, res) => {
  console.log('=== PRODUCTS REQUEST ===');
  console.log('Cache valid:', productsCache && cacheTime);
  console.log('Cache age:', Date.now() - cacheTime, 'ms');
  // ... rest of code
});
```

**Test Scraper Directly:**
```bash
cd backend
node -e "
const { scrapeServeonyx } = require('./scrapers/serveonyx');
scrapeServeonyx('msarwo@fb.com', 'coffeeatmeta')
  .then(products => console.log('Found:', products.length, 'products'))
  .catch(err => console.error('Error:', err.message));
"
```

### Common Issues & Solutions

#### Issue: "Cannot GET /api/products"
**Solution:**
- Verify backend is running
- Check port 5000 is correct
- Check URL in frontend .env

#### Issue: CORS Error
**Solution:**
- Restart backend
- Check CORS is enabled in `server.js`
- Verify frontend and backend URLs match

#### Issue: Products Empty
**Solution:**
- Check Serveonyx credentials
- Verify website is accessible
- Check backend logs for scraping errors
- Try refresh instead of cached data

#### Issue: "Port already in use"
**Solution:**
- Change PORT in `.env`
- Or kill process: `lsof -i :5000 && kill -9 <PID>`

#### Issue: Slow Product Loading
**Solution:**
- Wait (first load takes time for scraping)
- Increase timeout in scraper
- Check internet speed
- Refresh after cache expires

### Automated Testing (Future)

#### Unit Tests

Create `backend/tests/scrapers.test.js`:
```javascript
const { scrapeServeonyx } = require('../scrapers/serveonyx');

describe('Serveonyx Scraper', () => {
  test('should return array of products', async () => {
    const products = await scrapeServeonyx(
      'test@example.com',
      'password'
    );
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
  });

  test('should include price field', async () => {
    const products = await scrapeServeonyx(
      'test@example.com',
      'password'
    );
    products.forEach(product => {
      expect(product.price).toBeDefined();
      expect(typeof product.price).toBe('number');
    });
  });
});
```

Run tests:
```bash
npm test
```

#### E2E Tests

Use Cypress for end-to-end testing:

```bash
npm install --save-dev cypress
npx cypress open
```

Create test file `cypress/e2e/shopping.cy.js`:
```javascript
describe('Coffee Shopping Flow', () => {
  it('should load products and add to cart', () => {
    cy.visit('http://localhost:3000');
    cy.contains('Refresh Products').click();
    cy.get('.product-card').first().find('.add-to-cart').click();
    cy.contains('Your Cart').should('exist');
  });
});
```

---

## Development Workflow

### Making Changes to Backend

1. Stop backend (Ctrl+C)
2. Edit files in `backend/`
3. Run `npm start` to restart
4. Test endpoints with cURL or REST Client

### Making Changes to Frontend

1. Edit files in `frontend/src/`
2. Frontend auto-reloads
3. Check browser for changes
4. Fix any console errors

### Adding New Features

Example: Add inventory tracking

1. **Backend:** Update API to return stock levels
2. **Frontend:** Display stock in product card
3. **Test:** Verify changes work end-to-end

### Committing Changes

```bash
git add .
git commit -m "Add inventory tracking feature"
git push origin main
```

---

## Performance Monitoring

### Frontend Performance

Use Lighthouse (built into Chrome DevTools):
1. Open DevTools (F12)
2. Go to "Lighthouse" tab
3. Click "Generate report"
4. Review Performance, Accessibility scores

### Backend Performance

Monitor with npm package:
```bash
npm install -g clinic
clinic doctor -- node backend/server.js
```

### Load Testing

Use Apache Bench:
```bash
# Make 100 requests, 10 concurrent
ab -n 100 -c 10 http://localhost:5000/api/products
```

---

## Deployment Testing

Before deploying to production:

1. **Build Frontend:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Test Production Build:**
   ```bash
   npm install -g serve
   serve -s build -l 3000
   ```

3. **Test Backend with Environment:**
   ```bash
   NODE_ENV=production npm start
   ```

4. **Run Full Test Suite:**
   - Load products
   - Add to cart
   - Checkout
   - Verify all functions work

---

## Next Steps

- [ ] Set up GitHub Actions for CI/CD
- [ ] Add unit tests
- [ ] Add E2E tests
- [ ] Monitor production performance
- [ ] Collect user feedback
- [ ] Iterate on features

---

For more information, see:
- `README.md` - Project overview
- `API.md` - API documentation
- `DEPLOYMENT.md` - Production deployment
