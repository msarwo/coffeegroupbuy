# Configuration Reference

## Environment Variables

### Backend Configuration (.env)

Located: `backend/.env`

```bash
# Server Port
PORT=5000

# Onyx Coffee Lab Credentials
SERVEONYX_EMAIL=msarwo@fb.com
SERVEONYX_PASSWORD=coffeeatmeta

# Venmo Payment
VENMO_USERNAME=your-venmo-username

# Environment
NODE_ENV=development
```

#### Variables Explained

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| PORT | Express server port | 5000 | Yes |
| SERVEONYX_EMAIL | Email for Onyx Coffee Lab login | msarwo@fb.com | Yes |
| SERVEONYX_PASSWORD | Password for Onyx Coffee Lab | coffeeatmeta | Yes |
| VENMO_USERNAME | Your Venmo username | @yourname | Yes |
| NODE_ENV | Environment mode | development/production | No |

### Frontend Configuration (.env)

Located: `frontend/.env`

```bash
# API Server URL
REACT_APP_API_URL=http://localhost:5000
```

#### Variables Explained

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| REACT_APP_API_URL | Backend API base URL | http://localhost:5000 | No |

## Server Configuration

### Backend (server.js)

**Key Settings:**

```javascript
// Port - change if 5000 is in use
const PORT = process.env.PORT || 5000;

// CORS settings
app.use(cors());

// Cache duration
const CACHE_DURATION = 3600000; // 1 hour
```

**To modify:**
1. Edit `backend/server.js`
2. Update constants at the top
3. Restart server

### Frontend (App.js)

**Key Settings:**

```javascript
// API Base URL
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';
```

**To modify:**
1. Edit `frontend/src/App.js`
2. Update constants at the top
3. Frontend auto-reloads

## Scraper Configuration

Located: `backend/scrapers/serveonyx.js`

**Key Settings:**

```javascript
// Browser settings
headless: 'new'
args: ['--no-sandbox', '--disable-setuid-sandbox']

// Timeouts (milliseconds)
waitUntil: 'networkidle2'
timeout: 30000

// Page viewport
width: 1280
height: 720
```

**To modify:**
1. Edit `backend/scrapers/serveonyx.js`
2. Update settings in `scrapeServeonyx()` function
3. Restart backend

### Adjusting Timeouts

If scraping is slow or timing out:

```javascript
// Increase timeout
await page.goto('https://onyxcoffeelab.com/account/login', {
  waitUntil: 'networkidle2',
  timeout: 60000  // Increased from 30000
});
```

### Headless Mode

To see the browser while scraping (for debugging):

```javascript
headless: false  // Changed from 'new'
```

## Frontend Styling

Located: `frontend/src/App.css`

**Key Colors:**

```css
/* Coffee/Brown Theme */
--primary: #D2691E;      /* Chocolate brown */
--dark: #8B4513;         /* Dark brown */
--light: #E8D7B8;        /* Light tan */
--background: #f5f5f5;   /* Light gray */
```

**To customize:**
1. Edit color values in `App.css`
2. Update gradient backgrounds
3. Frontend auto-reloads

### Responsive Breakpoints

```css
/* Mobile: < 768px */
@media (max-width: 768px) {
  /* Mobile styles */
}

/* Tablet: 768px - 1024px */
/* Desktop: > 1024px */
```

## API Configuration

### Product Pricing Markup

**Location:** `backend/server.js`

```javascript
// Apply 5% markup
price: parseFloat((product.price * 1.05).toFixed(2))
```

**To change markup percentage:**
1. Open `backend/server.js`
2. Find the markup calculation
3. Change `1.05` to desired multiplier:
   - `1.10` = 10% markup
   - `1.15` = 15% markup
   - `1.02` = 2% markup

### Cache Duration

**Location:** `backend/server.js`

```javascript
const CACHE_DURATION = 3600000; // 1 hour
```

**Convert milliseconds:**
- 60,000 = 1 minute
- 300,000 = 5 minutes
- 600,000 = 10 minutes
- 3,600,000 = 1 hour (default)
- 86,400,000 = 1 day

**To change cache duration:**
1. Edit `backend/server.js`
2. Update `CACHE_DURATION` value
3. Restart backend

## Development Tools

### VS Code Settings

Located: `.vscode/launch.json` and `.vscode/tasks.json`

**Debug Configuration:**
- Press F5 to start debugging
- Breakpoints work in server.js
- Console logging visible

**Tasks:**
- Run backend with `npm start`
- Run frontend separately

### Environment Specific Config

**Development (.env):**
```
NODE_ENV=development
REACT_APP_DEBUG=true
```

**Production (before deploy):**
```
NODE_ENV=production
REACT_APP_DEBUG=false
```

## Database Configuration (Future)

When adding a database:

1. Create `.env` entry:
   ```
   DATABASE_URL=mongodb://...
   ```

2. Update backend/server.js:
   ```javascript
   const db = require('./database');
   await db.connect(process.env.DATABASE_URL);
   ```

3. Create connection file

## Payment Integration

### Current: Venmo

**Configuration:**
- Only requires username in `.env`
- Links to: `https://venmo.com/{username}`
- Order details included in payment request

**To change Venmo username:**
1. Edit `backend/.env`
2. Set correct `VENMO_USERNAME`
3. Restart backend

### Future: Other Payment Methods

**Add to `backend/.env`:**
```
# Stripe
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# PayPal
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...

# Square
SQUARE_ACCESS_TOKEN=...
```

## Authentication (Future)

When adding user auth:

**Backend .env:**
```
JWT_SECRET=your-secret-key
SESSION_SECRET=your-session-secret
```

**Frontend .env:**
```
REACT_APP_AUTH_ENABLED=true
```

## Logging Configuration

### Backend Logging

Current: Console logging

**To add file logging:**
1. Install: `npm install winston`
2. Create `backend/logger.js`
3. Import and use in `server.js`

### Frontend Logging

Current: Browser console

**To add error tracking:**
1. Install Sentry: `npm install @sentry/react`
2. Initialize in `frontend/index.js`
3. Report errors to dashboard

## Security Configuration (Production)

### Secrets Management

**Never commit:**
- `.env` files
- API keys
- Passwords
- Tokens

**Use instead:**
- Environment variables
- Secret management service
- Azure Key Vault
- AWS Secrets Manager

### SSL/TLS

For production:
```
BACKEND_URL=https://your-domain.com
FRONTEND_URL=https://www.your-domain.com
```

### CORS Settings

Current (Development):
```javascript
app.use(cors()); // Allow all origins
```

Production:
```javascript
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST']
};
app.use(cors(corsOptions));
```

## Performance Tuning

### Increase Cache Duration

For stable product lists:
```javascript
const CACHE_DURATION = 86400000; // 1 day
```

### Optimize Bundle Size

```bash
cd frontend
npm run build
```

Check size with:
```bash
npm run build -- --analyze
```

### Database Query Optimization

(When database is added)
- Add indexes on frequently queried fields
- Use pagination for large result sets
- Cache query results

## Monitoring Configuration (Future)

Add to `.env`:
```
SENTRY_DSN=https://...
LOG_LEVEL=info
METRICS_ENABLED=true
```

## Configuration Checklist

Before running:
- [ ] Backend `.env` has correct Onyx Coffee Lab credentials
- [ ] Backend `.env` has Venmo username
- [ ] Frontend `.env` has correct API URL
- [ ] Port 5000 is available (or changed in `.env`)
- [ ] Port 3000 is available (or changed for frontend)
- [ ] Internet connection active

Before production:
- [ ] Update NODE_ENV to production
- [ ] Set secure Venmo username
- [ ] Add HTTPS/SSL
- [ ] Enable authentication
- [ ] Set up monitoring/logging
- [ ] Configure backups
- [ ] Review security settings

---

For more details, see:
- `README.md` - Project overview
- `DEPLOYMENT.md` - Production deployment
- `API.md` - API configuration
