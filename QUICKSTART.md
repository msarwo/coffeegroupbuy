# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies

**On Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

**On Windows:**
```cmd
setup.bat
```

Or manually:
```bash
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

### Step 2: Configure Credentials

Edit `backend/.env`:
```
PORT=5000
SERVEONYX_EMAIL=msarwo@fb.com
SERVEONYX_PASSWORD=coffeeatmeta
VENMO_USERNAME=your-venmo-username
```

### Step 3: Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

Visit `http://localhost:3000` in your browser!

## 📋 What Happens

1. **Frontend** loads at `http://localhost:3000`
2. **Backend API** runs at `http://localhost:5000`
3. Frontend fetches coffee products from API
4. Backend scrapes Serveonyx with your credentials
5. Products show with 5% markup applied
6. Add items to cart and proceed to Venmo payment

## 🎯 Features at a Glance

- ☕ Browse all coffee products
- 💰 See 5% markup pricing
- 🛒 Shopping cart functionality
- 💳 Venmo payment integration
- 🔄 Auto-refresh product cache
- 📱 Fully responsive design

## 📚 For More Info

- See `README.md` for full documentation
- See `DEPLOYMENT.md` for production setup
- Check `backend/` for API server code
- Check `frontend/` for React app code

## ⚡ Troubleshooting

**Port 3000 already in use?**
```bash
cd frontend && PORT=3001 npm start
```

**Port 5000 already in use?**
Edit `backend/.env` and change PORT

**CORS errors?**
Ensure backend is running before starting frontend

**Products not loading?**
Check backend logs, verify Serveonyx credentials in `.env`

---

**Happy coffee buying! ☕**
