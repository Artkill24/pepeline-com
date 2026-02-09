import { runBacktest, compareStrategies } from '@/lib/backtesting-engine';
import { getCache, setCache } from '@/lib/cache-helper';

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const days = parseInt(searchParams.get('days') || '180');
        const strategy = searchParams.get('strategy') || 'contrarian';
        const compare = searchParams.get('compare') === 'true';
        
        // Cache key
        const cacheKey = compare 
            ? `backtest-compare-${days}`
            : `backtest-${strategy}-${days}`;
        
        // Check cache (1 hour TTL)
        const cached = getCache(cacheKey);
        if (cached) {
            return Response.json(cached);
        }
        
        // Run backtest
        const result = compare 
            ? compareStrategies(days)
            : runBacktest(days, strategy);
        
        // Cache result
        setCache(cacheKey, result, 3600); // 1 hour
        
        return Response.json(result);
        
    } catch (error) {
        console.error('Backtest error:', error);
        return Response.json({ 
            error: 'Backtest failed',
            details: error.message 
        }, { status: 500 });
    }
}
