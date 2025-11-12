# API Documentation

## Base URL
```
http://localhost:5000
```

## Endpoints

### 1. Get All Products

**Endpoint:** `GET /api/products`

**Description:** Fetches all coffee products from Serveonyx with 5% markup applied. Results are cached for 1 hour.

**Query Parameters:** None

**Response:** 
```json
[
  {
    "name": "Ethiopian Yirgacheffe",
    "price": 25.50,
    "originalPrice": 24.29,
    "markup": 0.05,
    "url": "https://serveonyx.com/product/...",
    "image": "https://..."
  },
  {
    "name": "Colombian Medium Roast",
    "price": 23.10,
    "originalPrice": 22.00,
    "markup": 0.05,
    "url": "https://serveonyx.com/product/...",
    "image": "https://..."
  }
]
```

**Status Codes:**
- `200 OK` - Successfully fetched products
- `500 Internal Server Error` - Failed to fetch products

**Example:**
```bash
curl http://localhost:5000/api/products
```

---

### 2. Refresh Products

**Endpoint:** `POST /api/products/refresh`

**Description:** Forces a fresh scrape of products from Serveonyx, bypassing the cache.

**Request Body:** None

**Response:** Same as GET /api/products

**Status Codes:**
- `200 OK` - Successfully refreshed products
- `500 Internal Server Error` - Failed to refresh products

**Example:**
```bash
curl -X POST http://localhost:5000/api/products/refresh
```

---

### 3. Get Payment Information

**Endpoint:** `GET /api/payment-info`

**Description:** Retrieves Venmo payment information for checkout.

**Query Parameters:** None

**Response:**
```json
{
  "method": "venmo",
  "venmoUsername": "your-venmo-username",
  "instructions": "Send payment via Venmo to the username above. Please include order details in the memo."
}
```

**Status Codes:**
- `200 OK` - Successfully retrieved payment info

**Example:**
```bash
curl http://localhost:5000/api/payment-info
```

---

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error message describing what went wrong"
}
```

**Common Errors:**

1. **Scraping Failed**
   - Status: 500
   - Message: "Failed to fetch products"
   - Cause: Cannot connect to Serveonyx or login failed

2. **Invalid Credentials**
   - Status: 500
   - Message: "Failed to fetch products"
   - Cause: Serveonyx email/password incorrect

3. **Connection Error**
   - Status: 500
   - Message: "Failed to fetch products"
   - Cause: No internet connection or Serveonyx is down

---

## Data Structures

### Product Object

```typescript
{
  name: string;           // Product name
  price: number;          // Price with 5% markup
  originalPrice: number;  // Price from Serveonyx
  markup: number;         // Markup percentage (0.05 = 5%)
  url: string;            // Product URL
  image: string;          // Product image URL
}
```

### Payment Info Object

```typescript
{
  method: string;        // Payment method ("venmo")
  venmoUsername: string; // Venmo username
  instructions: string;  // Payment instructions
}
```

---

## Usage Examples

### JavaScript/Fetch

```javascript
// Get products
fetch('http://localhost:5000/api/products')
  .then(res => res.json())
  .then(products => console.log(products));

// Refresh products
fetch('http://localhost:5000/api/products/refresh', {
  method: 'POST'
})
  .then(res => res.json())
  .then(products => console.log(products));

// Get payment info
fetch('http://localhost:5000/api/payment-info')
  .then(res => res.json())
  .then(info => console.log(info));
```

### cURL

```bash
# Get products
curl http://localhost:5000/api/products

# Refresh products
curl -X POST http://localhost:5000/api/products/refresh

# Get payment info
curl http://localhost:5000/api/payment-info
```

### Python

```python
import requests

# Get products
products = requests.get('http://localhost:5000/api/products').json()
print(products)

# Refresh products
products = requests.post('http://localhost:5000/api/products/refresh').json()
print(products)

# Get payment info
payment_info = requests.get('http://localhost:5000/api/payment-info').json()
print(payment_info)
```

---

## Caching

- Products are cached for **1 hour** (3600000 milliseconds)
- Subsequent requests within this period return cached data
- Use the `/api/products/refresh` endpoint to force a fresh scrape
- Cache improves performance and reduces load on Serveonyx

---

## Rate Limiting

Currently, there is **no rate limiting** implemented. 

**Recommended:** Implement rate limiting in production to prevent abuse:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // 100 requests per windowMs
});

app.use('/api/', limiter);
```

---

## CORS

The backend includes CORS support for cross-origin requests. 

**Allowed Origins:** All (configurable)

**Allowed Methods:** GET, POST, PUT, DELETE, OPTIONS

**Allowed Headers:** Content-Type, Authorization

---

## Authentication

Currently, **no authentication** is required for API endpoints.

**For Production:**
- Implement JWT authentication
- Require API keys for endpoints
- Add user authorization checks

---

## Performance Tips

1. **Cache Products**: Frontend caches products after first fetch
2. **Minimize Refreshes**: Only refresh when necessary (user action)
3. **Batch Requests**: Load all data in one request
4. **CDN Images**: Store product images on CDN for faster loading

---

## Troubleshooting

### 500 Error on Products Endpoint

**Check:**
1. Backend server is running
2. Serveonyx credentials in `.env` are correct
3. Internet connection is active
4. Serveonyx website is accessible

**Debug:**
```bash
# Check backend logs
cd backend
npm start

# Test Serveonyx access
curl https://serveonyx.com
```

### Long Response Time

**Possible Causes:**
1. First request (scraping takes time)
2. Serveonyx website is slow
3. Network latency

**Solutions:**
1. Wait for cache to populate (runs periodically)
2. Increase Puppeteer timeout in `backend/scrapers/serveonyx.js`
3. Check network connection

### Missing Product Images

**Possible Causes:**
1. Serveonyx uses lazy loading
2. Image URLs are relative (not absolute)

**Solution:** Modify scraper to handle image loading properly

---

## Future Enhancements

- [ ] Authentication & user accounts
- [ ] Product filtering & search
- [ ] Database storage
- [ ] Order history tracking
- [ ] Payment confirmation webhooks
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] Product reviews & ratings

---

## Support

For API issues or bugs, check the backend logs:

```bash
cd backend
npm start
```

Look for error messages in the console output.
