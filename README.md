# Coffee Group Buy Website

A full-stack web application for wholesale coffee group buying with Venmo payment integration.

## Features

✨ **Product Display**
- Automatically scrapes coffee products from Onyx Coffee Lab (onyxcoffeelab.com)
- Displays real-time pricing with 5% markup applied
- Beautiful responsive product grid layout
- Product images and details

🛒 **Shopping Cart**
- Add/remove products
- Adjust quantities
- Real-time cart total
- Cart summary sidebar

💳 **Payment Integration**
- Venmo payment integration
- Easy checkout process
- Order summary generation

📊 **Backend Features**
- Express.js REST API
- Web scraping with Puppeteer
- Product caching (1 hour)
- CORS enabled
- Clean API endpoints

## Project Structure

```
coffeegroupbuy/
├── backend/
│   ├── scrapers/
│   │   └── serveonyx.js      # Onyx Coffee Lab web scraper
│   ├── server.js              # Express server
│   ├── .env                   # Environment variables
│   └── package.json           # Backend dependencies
├── frontend/
│   ├── public/
│   │   └── index.html         # HTML template
│   ├── src/
│   │   ├── App.js             # React main component
│   │   ├── App.css            # App styles
│   │   ├── index.js           # React entry point
│   │   └── index.css          # Global styles
│   └── package.json           # Frontend dependencies
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14+)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Edit `.env` file with your details:
   ```
   PORT=5000
   SERVEONYX_EMAIL=msarwo@fb.com
   SERVEONYX_PASSWORD=coffeeatmeta
   VENMO_USERNAME=your-venmo-username
   ```

4. Start the backend server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. In a new terminal, navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will open on `http://localhost:3000`

### GitHub Pages Deployment

You can deploy the frontend to GitHub Pages. The repository already includes a GitHub Actions workflow that builds the React app and deploys `frontend/build` to GitHub Pages on pushes to the `main` branch.

Steps:

1. Ensure your repository is pushed to GitHub and `main` is the branch you want to publish from.
2. (Optional) Edit `frontend/package.json` `homepage` field if you prefer an absolute URL (default is `.` for relative paths).
3. Push to `main`. The Actions workflow `.github/workflows/deploy-pages.yml` will run and publish the site to GitHub Pages.

After the workflow completes, GitHub Pages will serve the site from the repository's Pages settings (for user/repo Pages or organization Pages). If you need a custom URL or a different branch, update repository settings accordingly.

## API Endpoints

### `GET /api/products`
Fetches all coffee products with 5% markup applied.

**Response:**
```json
[
  {
    "name": "Coffee Name",
    "price": 25.50,
    "originalPrice": 24.29,
    "markup": 0.05,
    "url": "https://...",
    "image": "https://..."
  }
]
```

### `POST /api/products/refresh`
Forces a fresh scrape of products (bypasses cache).

### `GET /api/payment-info`
Gets Venmo payment information.

**Response:**
```json
{
  "method": "venmo",
  "venmoUsername": "your-venmo-username",
  "instructions": "Send payment via Venmo..."
}
```

## How It Works

1. **Product Scraping**: The backend uses Puppeteer to automatically log into onyxcoffeelab.com and extract all available coffee products with pricing.

2. **Price Markup**: All prices are automatically increased by 5% to account for fees.

3. **Shopping**: Users browse products in a beautiful grid layout, add items to cart, and adjust quantities.

4. **Payment**: Users checkout through Venmo with their order details auto-populated.

## Technology Stack

**Backend:**
- Express.js - Web server framework
- Puppeteer - Web scraping
- Axios - HTTP client
- Node.js - Runtime

**Frontend:**
- React - UI framework
- Axios - HTTP client
- CSS3 - Styling

## Configuration

Edit `.env` files in backend and frontend directories:

### Backend .env
```
PORT=5000
SERVEONYX_EMAIL=your-email@example.com
SERVEONYX_PASSWORD=your-password
VENMO_USERNAME=your-venmo-username
NODE_ENV=development
```

### Frontend .env
```
REACT_APP_API_URL=http://localhost:5000
```

## Troubleshooting

### Products not loading?
- Check that backend is running on port 5000
- Verify Onyx Coffee Lab credentials in `.env`
- Check browser console for CORS errors

### Scraping fails?
- Verify internet connection
- Check Onyx Coffee Lab website is accessible
- Ensure credentials are correct
- Check backend logs for detailed errors

### Port already in use?
- Change PORT in `.env` file
- Or kill process using the port

## Features for Future Enhancement

- 🔐 User authentication
- 📦 Order history
- 🚚 Shipping integration
- 💰 Multiple payment methods
- 📧 Email notifications
- 🏪 Admin dashboard
- 📱 Mobile app

## License

MIT

## Support

For issues or questions, please create an issue in the repository.

---

**Created for Coffee Club Group Buying**