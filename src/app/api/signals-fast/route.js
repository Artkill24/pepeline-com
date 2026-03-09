import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
    const signals = [
        {
            symbol: 'BTC',
            signal: 'BUY',
            strength: 85,
            confidence: 'HIGH',
            price: 69000,
            change24h: 3.2,
            reasoning: 'Strong bullish momentum'
        },
        {
            symbol: 'ETH',
            signal: 'BUY',
            strength: 78,
            confidence: 'MEDIUM',
            price: 3500,
            change24h: 2.5,
            reasoning: 'Positive trend'
        },
        {
            symbol: 'SOL',
            signal: 'HOLD',
            strength: 65,
            confidence: 'MEDIUM',
            price: 145,
            change24h: -0.5,
            reasoning: 'Consolidation'
        },
        {
            symbol: 'AVAX',
            signal: 'BUY',
            strength: 82,
            confidence: 'HIGH',
            price: 42,
            change24h: 4.8,
            reasoning: 'Breakout pattern'
        }
    ];
    
    return NextResponse.json({
        success: true,
        signals,
        strongSignals: signals.filter(s => s.strength >= 75).length,
        topSignal: signals[0],
        timestamp: new Date().toISOString(),
        mode: 'FAST'
    });
}
