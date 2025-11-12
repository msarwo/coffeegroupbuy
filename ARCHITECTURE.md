# Architecture & Data Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         COFFEE GROUP BUY                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────  FRONTEND  ─────────────────────┐  │
│  │                                                             │  │
│  │  React Application (http://localhost:3000)               │  │
│  │  ┌─────────────────────────────────────────────────┐     │  │
│  │  │ Components:                                      │     │  │
│  │  │ • App.js - Main component                       │     │  │
│  │  │ • Product Grid - Display products              │     │  │
│  │  │ • Shopping Cart - Manage items                 │     │  │
│  │  │ • Payment Info - Venmo details                 │     │  │
│  │  └─────────────────────────────────────────────────┘     │  │
│  │                                                             │  │
│  │  Styling:                                                 │  │
│  │  • App.css - Component styles                           │  │
│  │  • Coffee theme (browns & tans)                         │  │
│  │  • Responsive design (mobile to desktop)                │  │
│  │                                                             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                          ↓ HTTP API ↓                           │
│  ┌─────────────────────────  BACKEND  ──────────────────────┐  │
│  │                                                             │  │
│  │  Express.js Server (http://localhost:5000)               │  │
│  │  ┌─────────────────────────────────────────────────┐     │  │
│  │  │ REST API Endpoints:                             │     │  │
│  │  │ • GET /api/products - Get all products          │     │  │
│  │  │ • POST /api/products/refresh - Refresh data    │     │  │
│  │  │ • GET /api/payment-info - Get Venmo info       │     │  │
│  │  └─────────────────────────────────────────────────┘     │  │
│  │                                                             │  │
│  │  ┌──── Product Scraper ────┐                             │  │
│  │  │ Puppeteer              │                             │  │
│  │  │ • Launches browser     │                             │  │
│  │  │ • Logs into Serveonyx  │  ──► serveonyx.com         │  │
│  │  │ • Extracts products    │  (Wholesale Coffee)         │  │
│  │  │ • Applies 5% markup    │                             │  │
│  │  └────────────────────────┘                             │  │
│  │                                                             │  │
│  │  ┌──── Data Cache ────┐                                  │  │
│  │  │ 1-hour cache       │                                  │  │
│  │  │ Improves speed     │                                  │  │
│  │  │ Reduces requests   │                                  │  │
│  │  └────────────────────┘                                  │  │
│  │                                                             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│                    ↓ Payment Redirect ↓                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              VENMO PAYMENT (3rd party)                   │   │
│  │  • User clicks "Proceed to Payment"                     │   │
│  │  • Opens Venmo app/website                             │   │
│  │  • Order details pre-filled                            │   │
│  │  • User completes payment                              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

### 1. Loading Products

```
┌─────────────┐
│   Browser   │
│ (localhost) │
└──────┬──────┘
       │ Click "Refresh Products"
       ↓
┌─────────────────────┐
│  React Frontend     │
│  Makes API Request  │
└──────┬──────────────┘
       │ GET /api/products
       ↓
┌──────────────────────┐
│ Express Backend      │
│ Check Cache          │
└──────┬───────────────┘
       │ Cache expired?
       ├─ NO → Return cached data
       │
       └─ YES → Scrape Serveonyx
              ↓
         ┌─────────────────┐
         │   Puppeteer     │
         │ Browser Control │
         └────────┬────────┘
                  │
                  ├─ Navigate to https://serveonyx.com
                  │
                  ├─ Login with:
                  │  • Email: msarwo@fb.com
                  │  • Password: coffeeatmeta
                  │
                  ├─ Go to /shop page
                  │
                  ├─ Extract products:
                  │  • Name
                  │  • Price
                  │  • Image URL
                  │
                  └─→ Return to Backend
                        │
                        ├─ Apply 5% markup
                        │
                        ├─ Cache results
                        │
                        └─ Send JSON to Frontend
                              ↓
                         ┌──────────────┐
                         │ React Updates│
                         │ Product List │
                         └──────┬───────┘
                                │
                                └─→ Browser displays products
```

### 2. Shopping & Checkout

```
┌─────────────────────────────────────┐
│  User Browses Products              │
│  (Coffee Grid Display)              │
└──────────────┬──────────────────────┘
               │
               ├─ Add Item 1: $25.50
               ├─ Add Item 2: $18.75
               ├─ Add Item 3: $31.20
               │
               ↓
        ┌────────────────────┐
        │  Shopping Cart     │
        │  (Sidebar/Fixed)   │
        │                    │
        │  Ethiopian Coffee  │
        │  x2 = $51.00       │
        │                    │
        │  Colombian Roast   │
        │  x1 = $18.75       │
        │                    │
        │  Brazilian Blend   │
        │  x3 = $93.60       │
        │                    │
        │  TOTAL: $163.35    │
        └────────┬───────────┘
                 │
                 ├─ Adjust quantities
                 ├─ Remove items
                 │
                 └─ Click "Proceed to Payment"
                        ↓
        ┌──────────────────────────┐
        │ Generate Order Summary   │
        │                          │
        │ Ethiopian x2 @ $25.50    │
        │ Colombian x1 @ $18.75    │
        │ Brazilian x3 @ $31.20    │
        │ Total: $163.35           │
        └──────────┬───────────────┘
                   │
                   └─→ Open Venmo Link
                        https://venmo.com/yourname
                        (with order details in memo)
                              ↓
                        ┌──────────────┐
                        │  Venmo App   │
                        │  Payment     │
                        │  Complete    │
                        └──────────────┘
```

## Component Hierarchy

```
App
├── Header
│   ├── Title "☕ Coffee Group Buy"
│   └── Subtitle
│
├── Controls
│   └── "Refresh Products" Button
│
├── Product Grid
│   └── ProductCard (multiple)
│       ├── Image
│       ├── Name
│       ├── Original Price (crossed out)
│       ├── New Price (5% markup)
│       ├── Markup Badge
│       └── Add to Cart Button
│
├── Cart Summary (fixed sidebar)
│   ├── Cart Items
│   │   └── Item
│   │       ├── Name
│   │       ├── Quantity Controls (+/-)
│   │       ├── Price
│   │       └── Remove Button (✕)
│   │
│   ├── Cart Total
│   └── "Proceed to Payment" Button
│
└── Payment Info
    ├── Payment Method
    ├── Venmo Username
    └── Instructions
```

## File Relationships

```
backend/
├── server.js
│   ├── Uses → scrapers/serveonyx.js
│   ├── Imports → .env variables
│   └── Serves → JSON API responses
│
└── scrapers/
    └── serveonyx.js
        ├── Uses → Puppeteer
        ├── Reads → .env credentials
        └── Scrapes → https://serveonyx.com

frontend/
├── src/
│   ├── App.js
│   │   ├── Imports → axios (HTTP client)
│   │   ├── Uses → API endpoints from backend
│   │   └── Styles → App.css
│   │
│   ├── App.css
│   │   └── Styles → All components
│   │
│   ├── index.js
│   │   ├── Imports → App.js
│   │   └── Renders → to root DOM
│   │
│   └── index.css
│       └── Global styles
│
└── public/
    └── index.html
        └── HTML template for React

.env files
├── backend/.env
│   ├── SERVEONYX_EMAIL
│   ├── SERVEONYX_PASSWORD
│   └── VENMO_USERNAME
│
└── frontend/.env
    └── REACT_APP_API_URL
```

## Data Models

### Product Object

```javascript
{
  name: "Ethiopian Yirgacheffe",          // String
  price: 25.50,                           // Number (with 5% markup)
  originalPrice: 24.29,                   // Number (original)
  markup: 0.05,                           // Number (0.05 = 5%)
  url: "https://serveonyx.com/product/1", // String
  image: "https://..."                    // String (image URL)
}
```

### Cart Item Object

```javascript
{
  name: "Ethiopian Yirgacheffe",          // String
  price: 25.50,                           // Number
  quantity: 2,                            // Number
  url: "https://...",
  image: "https://..."
}
```

### Payment Info Object

```javascript
{
  method: "venmo",                        // String
  venmoUsername: "your-username",         // String
  instructions: "Send payment via Venmo..." // String
}
```

## API Request/Response Flow

### Request: Get Products

```
Frontend (React)
    ↓
axios.get('http://localhost:5000/api/products')
    ↓
HTTP GET Request
    ↓
Backend Express Server
    ↓
Check cache validity
    ↓
If valid: Return cached JSON
If invalid: Run scraper
    ↓
Puppeteer scrapes Serveonyx
    ↓
Apply 5% markup
    ↓
JSON Response
    ↓
Frontend receives data
    ↓
React updates state
    ↓
UI re-renders with products
```

## State Management

### Frontend State

```javascript
// Products loaded from API
const [products, setProducts] = useState([]);
// List of { name, price, quantity }

// Shopping cart items
const [cart, setCart] = useState([]);
// List of cart items

// Loading indicator
const [loading, setLoading] = useState(false);

// Error messages
const [error, setError] = useState('');

// Payment information
const [paymentInfo, setPaymentInfo] = useState(null);
```

### State Updates

```
User Action → Function → setState → React Re-render → UI Updates

Examples:
• Click "Refresh" → fetchProducts() → setProducts() → Grid updates
• Click "Add" → addToCart() → setCart() → Cart sidebar updates
• Click +/- → updateQuantity() → setCart() → Total recalculates
• API error → setError() → Error message displays
```

## Performance Flow

```
First Load:
  ├─ API request
  ├─ Backend scrapes Serveonyx (5-10 seconds)
  ├─ Apply 5% markup
  ├─ Store in cache
  └─ Return to frontend

Within 1 Hour:
  ├─ API request
  ├─ Backend checks cache (cache valid!)
  ├─ Return cached data (instant!)
  └─ Frontend updates

After 1 Hour:
  ├─ API request
  ├─ Cache expired → Re-scrape Serveonyx
  ├─ Update cache
  └─ Return to frontend

User Refresh:
  └─ POST /api/products/refresh (bypass cache, re-scrape)
```

## Error Handling Flow

```
API Request
    ↓
Server returns error?
    ├─ YES: JSON { error: "message" }
    │        ↓
    │        Frontend setError()
    │        ↓
    │        Display error banner
    │
    └─ NO: JSON { [products] }
           ↓
           Update state
           ↓
           Display products
```

---

For more details, see:
- `API.md` - API documentation
- `README.md` - Architecture overview
- Code comments in `backend/server.js` and `frontend/src/App.js`
