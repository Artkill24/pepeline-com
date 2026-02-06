#!/bin/bash

echo "🧪 Testing Pepeline APIs..."

BASE="http://localhost:3000"

echo ""
echo "1️⃣ Testing Index..."
curl -s "$BASE/api/index" | jq '.index, .emoji, .level'

echo ""
echo "2️⃣ Testing Advanced Metrics..."
curl -s "$BASE/api/advanced-metrics" | jq '.alphaScore, .signal'

echo ""
echo "3️⃣ Testing Analytics..."
curl -s "$BASE/api/analytics" | jq '.data.totalClicks'

echo ""
echo "4️⃣ Testing Auto-Tweet (Dry Run)..."
curl -s "$BASE/api/auto-tweet-advanced" | jq '.tweeted, .reason'

echo ""
echo "5️⃣ Testing Smart Scheduler..."
curl -s "$BASE/api/smart-tweet-scheduler" | jq '.tweeted, .type'

echo ""
echo "✅ All tests complete!"
