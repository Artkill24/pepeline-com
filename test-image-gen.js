const mockTrade = {
    coin: 'BTC',
    action: 'BUY',
    price: 95000,
    size: 750,
    strength: 85,
    pnl_percent: 3.5,
    llm_reasoning: 'Strong bullish momentum with positive market sentiment. Fear & Greed at 75 indicates controlled optimism. Whale activity supports the signal.'
};

fetch('http://localhost:3000/api/twitter/generate-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ trade: mockTrade })
})
.then(res => res.arrayBuffer())
.then(buffer => {
    require('fs').writeFileSync('test-trade-image.png', Buffer.from(buffer));
    console.log('✅ Image saved to test-trade-image.png');
})
.catch(err => console.error('❌ Error:', err));
