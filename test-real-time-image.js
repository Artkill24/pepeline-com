// Test con dati REALI
async function testRealTimeImage() {
    // Get current BTC price from CoinGecko
    const priceRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true');
    const priceData = await priceRes.json();
    
    const realPrice = priceData.bitcoin.usd;
    const realChange = priceData.bitcoin.usd_24h_change;
    
    console.log(`📊 Real BTC Price: $${realPrice.toLocaleString()}`);
    console.log(`📈 24h Change: ${realChange.toFixed(2)}%`);
    
    const mockTrade = {
        coin: 'BTC',
        action: 'BUY',
        price: realPrice, // REAL PRICE
        size: 750,
        strength: 85,
        pnl_percent: 3.5,
        change24h: realChange, // REAL CHANGE
        llm_reasoning: `Bitcoin showing strong momentum at $${Math.round(realPrice).toLocaleString()}. Market sentiment bullish with ${realChange >= 0 ? 'positive' : 'negative'} 24h change of ${realChange.toFixed(2)}%. Whale accumulation detected in current price range.`
    };

    const res = await fetch('http://localhost:3000/api/twitter/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trade: mockTrade })
    });
    
    const buffer = await res.arrayBuffer();
    require('fs').writeFileSync('real-time-trade-image.png', Buffer.from(buffer));
    console.log('✅ Real-time image saved!');
}

testRealTimeImage();
