import { trackSmartMoney, getDEXActivity } from '@/lib/smart-money-tracker';
import { getCache, setCache } from '@/lib/cache-helper';

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        // Check cache (5 minute TTL for smart money data)
        const cached = getCache('smart-money-data');
        if (cached) {
            return Response.json(cached);
        }
        
        // Fetch smart money data
        const smartMoney = await trackSmartMoney();
        
        // Example: Get DEX activity for a popular token (BTC/ETH)
        // In production, you'd track multiple tokens
        const dexActivity = await getDEXActivity('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'); // WETH
        
        const result = {
            smartMoney,
            dexActivity,
            timestamp: new Date().toISOString(),
            dataQuality: smartMoney.activeWallets > 0 ? 'good' : 'limited'
        };
        
        // Cache result
        setCache('smart-money-data', result, 300); // 5 minutes
        
        return Response.json(result);
        
    } catch (error) {
        console.error('Smart money API error:', error);
        return Response.json({ 
            error: 'Failed to fetch smart money data',
            details: error.message
        }, { status: 500 });
    }
}

// Specific token analysis
export async function POST(request) {
    try {
        const { tokenAddress } = await request.json();
        
        if (!tokenAddress) {
            return Response.json({ 
                error: 'Token address required' 
            }, { status: 400 });
        }
        
        const [dexActivity, recentTx] = await Promise.all([
            getDEXActivity(tokenAddress),
            monitorRecentTransactions(tokenAddress, 10)
        ]);
        
        return Response.json({
            tokenAddress,
            dexActivity,
            recentActivity: recentTx,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Token analysis error:', error);
        return Response.json({ 
            error: 'Analysis failed' 
        }, { status: 500 });
    }
}
