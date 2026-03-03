#!/bin/bash

echo "🚀 QUICK TWITTER POST TEST"
echo ""

# Check if server is running
if ! curl -s http://localhost:3000/api/test-image > /dev/null 2>&1; then
    echo "❌ Dev server not running!"
    echo "   Run: npm run dev"
    exit 1
fi

echo "✓ Server running"
echo ""

# Run test
node test-twitter-post.js

echo ""
echo "📸 Check generated image: twitter-post-test.png"
