import { NextResponse } from 'next/server';

// Simplified signals endpoint - NO external API calls
// Uses mock data for instant response
export async function GET(request) {
    const mockSignals = [
        {
            symbol: 'BTC',
            signal: 'BUY',
            strength: 85,
            confidence: 'HIGH',
            price: 95000,
            change24h: 3.5,
            reasoning: 'Strong bullish momentum'
        },
        {
            symbol: 'ETH',
            signal: 'BUY',
            strength: 78,
            confidence: 'MEDIUM',
            price: 3500,
            change24h: 2.1,
            reasoning: 'Positive trend'
        },
        {
            symbol: 'SOL',
            signal: 'HOLD',
            strength: 65,
            confidence: 'MEDIUM',
            price: 145,
            change24h: -0.5,
            reasoning: 'Neutral momentum'
        },
        {
            symbol: 'DOGE',
            signal: 'SELL',
            strength: 45,
            confidence: 'LOW',
            price: 0.15,
            change24h: -8.2,
            reasoning: 'Weak performance'
        },
        {
            symbol: 'AVAX',
            signal: 'BUY',
            strength: 82,
            confidence: 'HIGH',
            price: 42,
            change24h: 4.8,
            reasoning: 'Breaking resistance'
        }
    ];

    return NextResponse.json({
        success: true,
        signals: mockSignals,
        timestamp: new Date().toISOString(),
        note: 'Fast endpoint - mock data for agent testing'
    });
}
