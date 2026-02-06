import { getSupraPrices, getSupraMarketData } from '@/lib/supra-helper';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const startTime = Date.now();
        
        // Test Supra connection
        const [prices, marketData] = await Promise.all([
            getSupraPrices(['btc', 'eth']),
            getSupraMarketData()
        ]);
        
        const latency = Date.now() - startTime;
        
        return Response.json({
            active: prices !== null,
            priceFeeds: prices ? Object.keys(prices).length : 0,
            latency,
            confidence: prices ? 100 : 0,
            marketData: marketData || null,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Supra status error:', error);
        return Response.json({
            active: false,
            error: error.message
        }, { status: 500 });
    }
}
