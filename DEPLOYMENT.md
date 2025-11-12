# Deployment Guide

## Running Both Frontend and Backend

### Option 1: Separate Terminals (Recommended for Development)

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm start
```

### Option 2: Using Concurrently (Single Terminal)

1. Install concurrently in root directory:
```bash
npm install concurrently
```

2. Update root package.json:
```json
{
  "scripts": {
    "dev": "concurrently \"cd backend && npm start\" \"cd frontend && npm start\"",
    "install-all": "npm install && cd backend && npm install && cd ../frontend && npm install"
  }
}
```

3. Run:
```bash
npm install-all
npm run dev
```

## Production Deployment

### Build Frontend

```bash
cd frontend
npm run build
```

This creates an optimized production build in `frontend/build/`

### Deploy Backend

1. Set production environment variables
2. Use process manager like PM2:
```bash
npm install -g pm2
pm2 start backend/server.js --name coffee-api
```

### Serve Frontend from Backend

1. Update backend server.js to serve frontend:
```javascript
const express = require('express');
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, '../frontend/build')));

// ... API routes ...

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});
```

2. Access at `http://your-domain.com`

## Docker Setup (Optional)

Create `Dockerfile` in root:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

RUN cd backend && npm install
RUN cd frontend && npm install

COPY . .

RUN cd frontend && npm run build

EXPOSE 5000

CMD ["node", "backend/server.js"]
```

Build and run:
```bash
docker build -t coffee-groupbuy .
docker run -p 5000:5000 coffee-groupbuy
```

## Environment Variables for Production

Update backend `.env`:
```
PORT=5000
SERVEONYX_EMAIL=your-email@example.com
SERVEONYX_PASSWORD=your-password
VENMO_USERNAME=your-venmo-username
NODE_ENV=production
```

## Troubleshooting Deployment

- Ensure ports 3000 (frontend) and 5000 (backend) are accessible
- Check CORS settings in backend for production domain
- Verify environment variables are set correctly
- Check server logs for errors
