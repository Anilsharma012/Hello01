#!/bin/bash

# TathaGat Admin Panel Startup Script
# This script starts both backend and frontend

echo "🚀 Starting TathaGat Admin Panel..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js found"
echo ""

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📥 Installing frontend dependencies..."
    npm install
fi

echo "✅ Frontend dependencies ready"
echo ""

# Check if backend is already running on port 5000
if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "⚠️  Port 5000 is already in use. Backend might already be running."
else
    echo "🔄 Starting backend server on port 5000..."
    node server.js &
    BACKEND_PID=$!
    echo "✅ Backend started (PID: $BACKEND_PID)"
fi

echo ""
echo "⏳ Waiting 3 seconds for backend to start..."
sleep 3

echo ""
echo "🖥️  Starting frontend server on port 3003..."
echo ""
echo "====================================="
echo "🎉 Admin Panel Starting!"
echo "====================================="
echo ""
echo "Backend:  http://localhost:5000"
echo "Frontend: http://localhost:3003"
echo "Admin:    http://localhost:3003/admin"
echo ""
echo "Press Ctrl+C to stop"
echo ""

# Start frontend
npm start
