/**
 * Test Manual Twitter Posting
 * Shows complete flow: price fetch -> image gen -> tweet creation
 */

async function testCompleteFlow() {
    console.log('🐦 TWITTER POST TEST - COMPLETE FLOW\n');
    console.log('='.repeat(60));
    
    // STEP 1: Get real-time price
    console.log('\n📊 STEP 1: Fetching real-time Bitcoin price...');
    
    const priceRes = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true'
    );
    const priceData = await priceRes.json();
    
    const realPrice = priceData.bitcoin.usd;
    const realChange = priceData.bitcoin.usd_24h_change;
    
    console.log(`   ✓ Current BTC Price: $${realPrice.toLocaleString()}`);
    console.log(`   ✓ 24h Change: ${realChange >= 0 ? '+' : ''}${realChange.toFixed(2)}%`);
    
    // STEP 2: Create trade object
    console.log('\n🤖 STEP 2: Creating trade from AI agent...');
    
    const trade = {
        coin: 'BTC',
        action: 'BUY',
        price: realPrice,
        size: 750,
        strength: 85,
        pnl_percent: 2.34,
        change24h: realChange,
        llm_reasoning: `Bitcoin showing strong momentum at $${Math.round(realPrice).toLocaleString()}. Fear & Greed index at 72 indicates controlled optimism. Whale accumulation detected in the $${Math.round(realPrice - 1000)}-${Math.round(realPrice)} range. Technical indicators suggest continuation of upward trend.`,
        timestamp: new Date().toISOString()
    };
    
    console.log('   ✓ Trade created:', JSON.stringify(trade, null, 2));
    
    // STEP 3: Generate image
    console.log('\n🎨 STEP 3: Generating tweet image...');
    
    const imageRes = await fetch('http://localhost:3000/api/twitter/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trade })
    });
    
    if (!imageRes.ok) {
        throw new Error(`Image generation failed: ${imageRes.status}`);
    }
    
    const imageBuffer = await imageRes.arrayBuffer();
    const imagePath = 'twitter-post-test.png';
    require('fs').writeFileSync(imagePath, Buffer.from(imageBuffer));
    
    console.log(`   ✓ Image generated: ${imagePath} (${imageBuffer.byteLength} bytes)`);
    
    // STEP 4: Create tweet text
    console.log('\n📝 STEP 4: Generating tweet text...');
    
    const tweetRes = await fetch('http://localhost:3000/api/twitter/post-trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trade })
    });
    
    const tweetData = await tweetRes.json();
    
    console.log('\n' + '='.repeat(60));
    console.log('📱 TWEET PREVIEW:');
    console.log('='.repeat(60));
    console.log(tweetData.tweet);
    console.log('='.repeat(60));
    
    // STEP 5: Summary
    console.log('\n✅ TEST COMPLETE!\n');
    console.log('Generated files:');
    console.log(`  📸 Image: ${imagePath}`);
    console.log(`  📄 Tweet text: Ready to post`);
    
    console.log('\n🚀 TO POST LIVE ON TWITTER:');
    console.log('  1. Get Twitter API keys from https://developer.twitter.com');
    console.log('  2. Add to .env.local:');
    console.log('     TWITTER_API_KEY=your_key');
    console.log('     TWITTER_API_SECRET=your_secret');
    console.log('     TWITTER_ACCESS_TOKEN=your_token');
    console.log('     TWITTER_ACCESS_SECRET=your_token_secret');
    console.log('  3. Run: npm install twitter-api-v2');
    console.log('  4. Enable posting in api/twitter/post-trade/route.js\n');
}

// Run test
testCompleteFlow().catch(err => {
    console.error('❌ Test failed:', err.message);
    process.exit(1);
});
