export const dynamic = 'force-dynamic';

const ALCHEMY_KEY = process.env.ALCHEMY_API_KEY;
const BASE_RPC = `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`;

// Top Base tokens to monitor
const BASE_TOKENS = {
    USDC: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
    BRETT: '0x532f27101965dd16442e59d40670faf5ebb142e4',
    DEGEN: '0x4ed4e862860bed51a9570b96d89af5e1b0efefed'
};

async function getBaseActivity() {
    try {
        const res = await fetch(BASE_RPC, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 1,
                method: 'eth_blockNumber',
                params: []
            })
        });
        
        const data = await res.json();
        const blockNumber = parseInt(data.result, 16);

        // Get recent block to analyze gas
        const blockRes = await fetch(BASE_RPC, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 2,
                method: 'eth_getBlockByNumber',
                params: ['latest', true]
            })
        });

        const block = await blockRes.json();
        const txCount = block.result?.transactions?.length || 0;

        // Calculate heat based on tx count
        const heat = txCount > 200 ? 'EXTREME' : 
                     txCount > 100 ? 'HIGH' : 
                     txCount > 50 ? 'MEDIUM' : 'LOW';

        return {
            network: 'Base',
            blockNumber,
            txCount,
            heat,
            signal: heat === 'EXTREME' || heat === 'HIGH' ? 'BULLISH' : 'NEUTRAL'
        };
    } catch (err) {
        console.error('Base metrics error:', err);
        return { network: 'Base', error: err.message };
    }
}

export async function GET() {
    try {
        const baseData = await getBaseActivity();
        return Response.json({
            ...baseData,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
