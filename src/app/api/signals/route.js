import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 30; // Vercel max

const COINS = [
    'BTC', 'ETH', 'SOL', 'BNB', 'XRP', 'DOGE', 'ADA', 
    'AVAX', 'LINK', 'MATIC', 'DOT', 'UNI', 'ATOM', 'LTC', 'NEAR'
];

export async function GET(request) {
    try {
        console.log('🔄 Fetching signals with fallback...');
        
        // TRY FAST ENDPOINT FIRST
        try {
            const fastRes = await fetch(
                `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/signals-fast`,
                { next: { revalidate: 30 } }
            );
            
            if (fastRes.ok) {
                const data = await fastRes.json();
                console.log('✓ Using fast signals:', data.signals.length);
                return NextResponse.json(data);
            }
        } catch (err) {
            console.log('Fast endpoint failed, using fallback...');
        }
        
        // FALLBACK TO MOCK DATA
        const mockSignals = [
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
                reasoning: 'Positive trend continuation'
            },
            {
                symbol: 'SOL',
                signal: 'HOLD',
                strength: 65,
                confidence: 'MEDIUM',
                price: 145,
                change24h: -0.5,
                reasoning: 'Consolidation phase'
            }
        ];
        
        console.log('✓ Using fallback mock signals');
        
        return NextResponse.json({
            signals: mockSignals,
            strongSignals: 2,
            topSignal: mockSignals[0],
            timestamp: new Date().toISOString(),
            mode: 'FALLBACK'
        });
        
    } catch (error) {
        console.error('❌ Signal error:', error.message);
        
        return NextResponse.json({
            signals: [],
            error: error.message,
            timestamp: new Date().toISOString()
        }, { status: 500 });
    }
}
