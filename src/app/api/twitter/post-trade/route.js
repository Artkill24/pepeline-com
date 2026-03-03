import { NextResponse } from 'next/server';

export async function POST(request) {
    const { trade } = await request.json();
    
    try {
        // Generate image
        const imageResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/twitter/generate-image`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ trade })
        });
        
        const imageBuffer = await imageResponse.arrayBuffer();
        
        // Generate tweet text
        const tweetText = generateTweetText(trade);
        
        // TODO: Upload to Twitter
        // const twitter = new TwitterApi({...});
        // const mediaId = await twitter.v1.uploadMedia(Buffer.from(imageBuffer));
        // await twitter.v2.tweet({ text: tweetText, media: { media_ids: [mediaId] } });
        
        console.log('📱 Tweet ready with image:');
        console.log(tweetText);
        console.log(`Image size: ${imageBuffer.byteLength} bytes`);
        
        return NextResponse.json({
            success: true,
            tweet: tweetText,
            imageSize: imageBuffer.byteLength,
            note: 'Tweet ready - add Twitter API keys to post live'
        });
        
    } catch (error) {
        console.error('Twitter post error:', error);
        
        return NextResponse.json({
            error: 'Failed to create tweet',
            details: error.message
        }, { status: 500 });
    }
}

function generateTweetText(trade) {
    const emoji = trade.action === 'BUY' ? '📈' : '📉';
    const pnl = trade.pnl_percent ? ` | P&L: ${trade.pnl_percent >= 0 ? '+' : ''}${trade.pnl_percent.toFixed(2)}%` : '';
    
    return `${emoji} AI Agent ${trade.action} Alert!

🪙 ${trade.coin}
💰 $${trade.size} @ $${trade.price.toLocaleString()}
⚡ Strength: ${trade.strength}/100${pnl}

🧠 ${trade.llm_reasoning?.substring(0, 100) || 'Automated execution'}...

#Crypto #AI #Trading #${trade.coin}

🤖 Live dashboard: pepeline.com/agents-dashboard`;
}
