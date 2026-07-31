#!/bin/bash

echo "🚀 Mr. COCO Bakery - Vercel Deployment Script"
echo "=============================================="
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "📦 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit - Mr. COCO Bakery"
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

echo ""
echo "📋 Next Steps:"
echo ""
echo "1️⃣  Create GitHub Repository:"
echo "   - Go to: https://github.com/new"
echo "   - Name: mrcoco-bakery"
echo "   - Keep it Public (or Private)"
echo "   - Don't add README, .gitignore, or license"
echo "   - Click 'Create repository'"
echo ""
echo "2️⃣  Push Your Code to GitHub:"
echo "   Run these commands:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/mrcoco-bakery.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3️⃣  Deploy on Vercel:"
echo "   - Go to: https://vercel.com/signup"
echo "   - Sign up with GitHub"
echo "   - Click 'New Project'"
echo "   - Import 'mrcoco-bakery' repository"
echo "   - Add Environment Variables (see DEPLOYMENT_GUIDE.md)"
echo "   - Click 'Deploy'"
echo ""
echo "4️⃣  Setup MongoDB Atlas (FREE):"
echo "   - Go to: https://www.mongodb.com/cloud/atlas/register"
echo "   - Create FREE account"
echo "   - Create FREE cluster (M0 - 512MB)"
echo "   - Get connection string"
echo "   - Add to Vercel environment variables"
echo ""
echo "=============================================="
echo "✅ Your code is ready for deployment!"
echo "📖 Check DEPLOYMENT_GUIDE.md for detailed steps"
echo "=============================================="
