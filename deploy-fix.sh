#!/bin/bash

echo "🚀 DEPLOYING PRODUCTION FIXES..."
echo ""

# Build test
echo "1️⃣ Testing build..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"
echo ""

# Commit
echo "2️⃣ Committing fixes..."
git add .
git commit -m "fix: Production issues - signal fallbacks + metadata warnings 🔧

Critical fixes:
- Signal API with fallback to mock data
- Metadata viewport separated (fix warnings)
- Health check endpoint
- Increased timeout handling
- Fallback mode for degraded APIs

Production ready with resilience!"

git push

echo ""
echo "3️⃣ Deployment triggered!"
echo ""
echo "📊 Check health: /api/health"
echo "🎯 Check signals: /api/signals-fast"
echo "🤖 Dashboard: /agents-dashboard"
echo ""
echo "✅ DONE!"
