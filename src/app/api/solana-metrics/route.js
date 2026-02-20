export const dynamic = 'force-dynamic';

const HELIUS_KEY = process.env.HELIUS_API_KEY;
const HELIUS_URL = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_KEY}`;

// Known Smart Money wallets on Solana (update with real addresses)
const SMART_WALLETS = [
    { address: 'pump...', label: 'Pump.fun Master', winRate: 0.85 },
    { address: 'anon...', label: 'SOL Whale #1', winRate: 0.78 },
    // Add more from Arkham/Nansen
];

async function getTokenCreations() {
    try {
        const res = await fetch(HELIUS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 'pepeline',
                method: 'getRecentPrioritizationFees',
                params: []
            })
        });
        const data = await res.json();
        return data.result || [];
    } catch {
        return [];
    }
}

async function getSmartMoneyActivity() {
    const activities = [];
    
    for (const wallet of SMART_WALLETS) {
        try {
            const res = await fetch(HELIUS_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    id: 1,
                    method: 'getSignaturesForAddress',
                    params: [wallet.address, { limit: 10 }]
                })
            });
            
            const data = await res.json();
            if (data.result) {
                activities.push({
                    wallet: wallet.label,
                    winRate: wallet.winRate,
                    recentTxs: data.result.length,
                    signal: wallet.winRate > 0.8 ? 'FOLLOW' : 'MONITOR'
                });
            }
        } catch (err) {
            console.error(`Smart wallet ${wallet.label} error:`, err);
        }
    }
    
    return activities;
}

export async function GET() {
    try {
        const [fees, smartMoney] = await Promise.all([
            getTokenCreations(),
            getSmartMoneyActivity()
        ]);

        // Calculate Solana "heat"
        const avgFee = fees.length > 0 
            ? fees.reduce((sum, f) => sum + (f.prioritizationFee || 0), 0) / fees.length 
            : 0;

        const heat = avgFee > 1000000 ? 'EXTREME' : 
                     avgFee > 500000 ? 'HIGH' : 
                     avgFee > 100000 ? 'MEDIUM' : 'LOW';

        // Smart Money signal
        const followSignals = smartMoney.filter(w => w.signal === 'FOLLOW').length;
        const smartSignal = followSignals >= 2 ? 'BULLISH' : 
                           followSignals === 1 ? 'NEUTRAL' : 'BEARISH';

        return Response.json({
            network: 'Solana',
            heat,
            avgPriorityFee: avgFee,
            smartMoney: {
                signal: smartSignal,
                followCount: followSignals,
                wallets: smartMoney
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
