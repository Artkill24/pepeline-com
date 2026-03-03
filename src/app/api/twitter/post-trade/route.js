import { NextResponse } from 'next/server';
import { TwitterApi } from 'twitter-api-v2';

export async function POST(request) {
    const { trade } = await request.json();
    
    try {
        // STEP 1: Generate image
        console.log('🎨 Generating tweet image...');
        
        const imageResponse = await fetch(
            `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/twitter/generate-image`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ trade })
            }
        );
        
        if (!imageResponse.ok) {
            throw new Error('Image generation failed');
        }
        
        const imageBuffer = await imageResponse.arrayBuffer();
        console.log(`✓ Image generated: ${imageBuffer.byteLength} bytes`);
        
        // STEP 2: Generate tweet text
        const tweetText = generateTweetText(trade);
        console.log('✓ Tweet text generated');
        
        // STEP 3: Check Twitter keys
        const hasTwitterKeys = 
            process.env.TWITTER_API_KEY && 
            process.env.TWITTER_API_SECRET &&
            process.env.TWITTER_ACCESS_TOKEN &&
            process.env.TWITTER_ACCESS_SECRET;
        
        if (!hasTwitterKeys) {
            console.log('⚠️ Twitter keys not found - simulation mode');
            return NextResponse.json({
                success: true,
                posted: false,
                simulation: true,
                tweet: tweetText,
                imageSize: imageBuffer.byteLength
            });
        }
        
        // STEP 4: POST TO TWITTER LIVE!
        console.log('🐦 Posting to Twitter LIVE...');
        
        const client = new TwitterApi({
            appKey: process.env.TWITTER_API_KEY,
            appSecret: process.env.TWITTER_API_SECRET,
            accessToken: process.env.TWITTER_ACCESS_TOKEN,
            accessSecret: process.env.TWITTER_ACCESS_SECRET,
        });
        
        // Upload image
        const mediaId = await client.v1.uploadMedia(Buffer.from(imageBuffer), {
            mimeType: 'image/png'
        });
        
        // Post tweet
        const tweet = await client.v2.tweet({
            text: tweetText,
            media: { media_ids: [mediaId] }
        });
        
        console.log('✅ TWEET POSTED!', tweet.data.id);
        
        return NextResponse.json({
            success: true,
            posted: true,
            tweetId: tweet.data.id,
            url: `https://twitter.com/user/status/${tweet.data.id}`
        });
        
    } catch (error) {
        console.error('❌ Error:', error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}

function generateTweetText(trade) {
    const emoji = trade.action === 'BUY' ? '📈' : '📉';
    const pnl = trade.pnl_percent 
        ? ` | P&L: ${trade.pnl_percent >= 0 ? '+' : ''}${trade.pnl_percent.toFixed(2)}%` 
        : '';
    
    const reasoning = trade.llm_reasoning 
        ? trade.llm_reasoning.substring(0, 100) + '...'
        : 'Automated execution';
    
    return `${emoji} AI Agent ${trade.action} Alert!

🪙 ${trade.coin}
💰 $${trade.size} @ $${trade.price.toLocaleString()}
⚡ Strength: ${trade.strength}/100${pnl}

🧠 ${reasoning}

#Crypto #AI #Trading #${trade.coin}

🤖 pepeline.com/agents-dashboard`;
}
