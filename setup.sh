#!/bin/bash

# Coffee Group Buy Setup Script

echo "🍵 Coffee Group Buy - Setup Script"
echo "===================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi
echo "✅ Backend dependencies installed"
cd ..
echo ""

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi
echo "✅ Frontend dependencies installed"
cd ..
echo ""

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Configure backend/.env with your Onyx Coffee Lab and Venmo credentials"
echo "2. In one terminal, run: cd backend && npm start"
echo "3. In another terminal, run: cd frontend && npm start"
echo ""
echo "The frontend will open at http://localhost:3000"
