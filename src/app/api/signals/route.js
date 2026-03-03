import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    const mockSignals = [
        { symbol: 'BTC', signal: 'BUY', strength: 85, price: 69000, change24h: 3.2 },
        { symbol: 'ETH', signal: 'BUY', strength: 78, price: 3500, change24h: 2.5 },
        { symbol: 'SOL', signal: 'HOLD', strength: 65, price: 145, change24h: -0.5 }
    ];
    
    return NextResponse.json({
        signals: mockSignals,
        timestamp: new Date().toISOString()
    });
}
