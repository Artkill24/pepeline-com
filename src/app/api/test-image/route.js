import { NextResponse } from 'next/server';
import { generateTradeTweetImage } from '@/lib/image-generation/tweet-image-generator';

export async function GET(request) {
    const mockTrade = {
        coin: 'BTC',
        action: 'BUY',
        price: 95000,
        size: 750,
        strength: 85,
        pnl_percent: 3.45,
        llm_reasoning: 'Strong bullish momentum with positive market sentiment. Fear & Greed at 75 indicates controlled optimism.'
    };
    
    try {
        const imageBuffer = await generateTradeTweetImage(mockTrade);
        
        return new NextResponse(imageBuffer, {
            headers: {
                'Content-Type': 'image/png',
                'Content-Length': imageBuffer.length,
                'Cache-Control': 'public, max-age=31536000'
            }
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
