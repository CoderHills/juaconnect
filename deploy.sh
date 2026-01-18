#!/bin/bash

# JuaConnect Automated Deployment Script
# This script helps deploy your application to Render.com
# Supports both separate repos OR a single monorepo

set -e

echo "🚀 JuaConnect Deployment Script"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

# Check if Git is installed
if ! command -v git &> /dev/null; then
    print_error "Git is not installed. Please install Git first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_warning "Node.js is not installed. Frontend build will be skipped."
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    print_error "Python 3 is not installed. Backend deployment will be affected."
    exit 1
fi

echo ""
echo "📦 Step 1: Preparing for Deployment"
echo "------------------------------------"

# Check if code is committed
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    print_error "Not a git repository. Please initialize git and commit your code."
    exit 1
fi

# Check for uncommitted changes
if ! git diff --quiet || ! git diff --cached --quiet; then
    print_warning "You have uncommitted changes. It's recommended to commit them before deployment."
    read -p "Do you want to commit changes? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter commit message: " commit_msg
        git add .
        git commit -m "$commit_msg"
        print_status "Changes committed."
    fi
fi

# Check if remote exists
if ! git remote get-url origin &> /dev/null; then
    print_warning "No remote origin found."
    read -p "Enter your GitHub repository URL: " repo_url
    git remote add origin "$repo_url"
    print_status "Remote origin added."
fi

echo ""
echo "🔨 Step 2: Building Frontend"
echo "-----------------------------"

if command -v npm &> /dev/null; then
    if [ -d "juaconnect-dashboard" ]; then
        cd juaconnect-dashboard
        
        # Check if node_modules exists
        if [ ! -d "node_modules" ]; then
            print_warning "Installing npm dependencies..."
            npm install
        fi
        
        # Build the frontend
        print_status "Building frontend..."
        npm run build
        
        if [ -d "dist" ]; then
            print_status "Frontend built successfully! Output in: juaconnect-dashboard/dist/"
        else
            print_error "Build failed - no dist directory found."
            exit 1
        fi
        
        cd ..
    else
        print_warning "Frontend directory (juaconnect-dashboard) not found. Skipping build."
    fi
else
    print_warning "Skipping frontend build (npm not found)."
fi

echo ""
echo "🐍 Step 3: Backend Preparation"
echo "-------------------------------"

if [ -d "juaconnect-backend" ]; then
    cd juaconnect-backend

    # Create .env file if it doesn't exist
    if [ ! -f ".env" ]; then
        print_warning "Creating .env file from template..."
        
        # Generate a secure JWT key
        JWT_KEY=$(python3 -c "import secrets; print(secrets.token_hex(32))" 2>/dev/null || echo "change-this-secret-key-32-characters-minimum")
        
        cat > .env << EOF
# Database (PostgreSQL connection string - get this from Render)
DATABASE_URL=postgresql://username:password@host:port/database_name

# Security (IMPORTANT: Change these in production!)
JWT_SECRET_KEY=$JWT_KEY
SECRET_KEY=$JWT_KEY

# Environment
FLASK_ENV=production
EOF
        
        print_status ".env file created. IMPORTANT: Update DATABASE_URL before deploying!"
    else
        print_status ".env file already exists."
    fi

    # Install dependencies
    print_status "Installing Python dependencies..."
    pip install -r requirements.txt -q

    cd ..
else
    print_warning "Backend directory (juaconnect-backend) not found."
fi

echo ""
echo "📋 Step 4: Deployment Summary"
echo "------------------------------"

echo "Your application is ready for deployment!"
echo ""

# Check if it's a monorepo or separate repos
if [ -d "juaconnect-backend" ] && [ -d "juaconnect-dashboard" ]; then
    echo "📁 Single Monorepo Detected"
    echo "   - Backend: juaconnect-backend/"
    echo "   - Frontend: juaconnect-dashboard/"
    echo ""
    echo "To deploy to Render.com (Monorepo Setup):"
    echo ""
    echo "1. Backend Deployment (Web Service):"
    echo "   - Go to https://dashboard.render.com"
    echo "   - Click 'New' → 'PostgreSQL' (create free database)"
    echo "   - Copy the DATABASE_URL from the database"
    echo "   - Click 'New' → 'Web Service'"
    echo "   - Connect your GitHub repository"
    echo "   - Root Directory: juaconnect-backend"
    echo "   - Set environment variables:"
    echo "     * DATABASE_URL: (paste from step above)"
    echo "     * JWT_SECRET_KEY: (generated in .env)"
    echo "     * FLASK_ENV: production"
    echo "   - Build Command: pip install -r requirements.txt"
    echo "   - Start Command: gunicorn --workers 4 --bind 0.0.0.0:\$PORT app:app"
    echo ""
    echo "2. Frontend Deployment (Static Site):"
    echo "   - Go to https://dashboard.render.com"
    echo "   - Click 'New' → 'Static Site'"
    echo "   - Connect your GitHub repository"
    echo "   - Root Directory: juaconnect-dashboard"
    echo "   - Set environment variable:"
    echo "     * VITE_API_URL: https://your-backend-service.onrender.com"
    echo "   - Build Command: npm install && npm run build"
    echo "   - Publish Directory: dist"
    echo ""
else
    echo "📁 Separate Repos Detected"
    echo ""
    echo "1. Backend Deployment:"
    echo "   - Go to https://dashboard.render.com"
    echo "   - Create PostgreSQL database"
    echo "   - Create Web Service for juaconnect-backend"
    echo "   - Build: pip install -r requirements.txt"
    echo "   - Start: gunicorn --workers 4 --bind 0.0.0.0:\$PORT app:app"
    echo "   - Set DATABASE_URL and JWT_SECRET_KEY"
    echo ""
    echo "2. Frontend Deployment:"
    echo "   - Create Static Site for juaconnect-dashboard"
    echo "   - Build: npm install && npm run build"
    echo "   - Publish: dist"
    echo "   - Set VITE_API_URL to your backend URL"
    echo ""
fi

echo "3. Or deploy frontend to Netlify:"
echo "   - Go to https://netlify.com"
echo "   - Drag and drop the 'juaconnect-dashboard/dist' folder"
echo "   - Set VITE_API_URL environment variable"
echo ""

read -p "Would you like me to open the Render dashboard? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v open &> /dev/null; then
        open https://dashboard.render.com
    elif command -v xdg-open &> /dev/null; then
        xdg-open https://dashboard.render.com
    else
        print_warning "Please visit: https://dashboard.render.com"
    fi
fi

echo ""
print_status "Deployment preparation complete! 🚀"
echo ""
echo "Next steps:"
echo "  1. Push code to GitHub: git push origin main"
echo "  2. Follow the deployment steps above"
echo "  3. Update frontend VITE_API_URL with your deployed backend URL"

