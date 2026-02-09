#!/bin/bash

echo "Testing Etherscan rate limits..."
echo ""

for i in {1..10}; do
    echo "Request $i/10"
    curl -s "https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=YourApiKeyToken" | jq -r '.status'
    sleep 0.2
done

echo ""
echo "Test complete!"
