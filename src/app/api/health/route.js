import { NextResponse } from 'next/server';

export async function GET() {
    const health = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        services: {}
    };
    
    // Check signals
    try {
        const signalsRes = await fetch(
            `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/signals-fast`,
            { signal: AbortSignal.timeout(3000) }
        );
        health.services.signals = signalsRes.ok ? 'ok' : 'degraded';
    } catch {
        health.services.signals = 'down';
    }
    
    // Check index
    try {
        const indexRes = await fetch(
            `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/index`,
            { signal: AbortSignal.timeout(3000) }
        );
        health.services.index = indexRes.ok ? 'ok' : 'degraded';
    } catch {
        health.services.index = 'down';
    }
    
    return NextResponse.json(health);
}
