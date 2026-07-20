#!/bin/bash
# =========================================================
# YY Leathers - Full Deployment Script for Netlify
# =========================================================
# This script builds the project and packages it with
# all Netlify Functions for drag-drop deployment.
#
# Usage:
#   bash deploy-full.sh
#
# Output: dist-netlify/ - Ready to deploy folder
# =========================================================

set -e

echo "🏗️  Building project..."
npm run build

echo "📁 Creating deployment package..."
rm -rf dist-netlify
mkdir -p dist-netlify

echo "📦 Copying static assets (dist)..."
cp -r dist/* dist-netlify/

echo "⚡ Copying Netlify Functions..."
mkdir -p dist-netlify/netlify/functions
cp -r netlify/functions/* dist-netlify/netlify/functions/

echo "⚙️  Copying _redirects (already in dist)..."
# _redirects is already copied from public/ by Vite build
# But ensure it exists for the root as well

echo "📝 Copying netlify.toml..."
cp netlify.toml dist-netlify/

echo "✅ Deployment package created in 'dist-netlify/'"
echo ""
echo "👉 Next steps:"
echo "   1. Go to https://app.netlify.com/drag"
echo "   2. Drag and drop the 'dist-netlify' folder"
echo "   3. Set environment variables in Netlify Dashboard:"
echo "      - RAZORPAY_KEY_ID"
echo "      - RAZORPAY_KEY_SECRET"
echo "      - VITE_RAZORPAY_KEY_ID"
echo "      - SUPABASE_URL"
echo "      - SUPABASE_ANON_KEY"
echo "      - VITE_SUPABASE_URL"
echo "      - VITE_SUPABASE_ANON_KEY"
echo "      - APP_URL"
echo ""
echo "🎯 For Git-based deployment (recommended), just push to GitHub"
echo "    and connect your repo to Netlify. The netlify.toml handles everything!"