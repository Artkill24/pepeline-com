#!/bin/bash

# Replace with your actual bot token
BOT_TOKEN="your_bot_token_here"

# Replace with your actual domain (dopo deploy Vercel)
WEBHOOK_URL="https://pepeline.com/api/telegram/webhook"

echo "Setting Telegram webhook..."

curl -F "url=$WEBHOOK_URL" \
     "https://api.telegram.org/bot$BOT_TOKEN/setWebhook"

echo ""
echo "Checking webhook info..."

curl "https://api.telegram.org/bot$BOT_TOKEN/getWebhookInfo"
