@echo off
REM Coffee Group Buy Setup Script for Windows

echo 🍵 Coffee Group Buy - Setup Script
echo ====================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    exit /b 1
)

echo ✅ Node.js version:
node --version
echo.

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    exit /b 1
)
echo ✅ Backend dependencies installed
cd ..
echo.

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    exit /b 1
)
echo ✅ Frontend dependencies installed
cd ..
echo.

echo ✅ Setup complete!
echo.
echo Next steps:
echo 1. Configure backend\.env with your Onyx Coffee Lab and Venmo credentials
echo 2. In one terminal, run: cd backend ^&^& npm start
echo 3. In another terminal, run: cd frontend ^&^& npm start
echo.
echo The frontend will open at http://localhost:3000
