export const dynamic = 'force-dynamic';

const ALCHEMY_KEY = process.env.ALCHEMY_API_KEY;
const ETH_RPC = `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`;

async function getCurrentGasPrice() {
    try {
        const res = await fetch(ETH_RPC, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 1,
                method: 'eth_gasPrice',
                params: []
            }),
            signal: AbortSignal.timeout(5000)
        });
        
        const data = await res.json();
        return parseInt(data.result, 16) / 1e9;
    } catch {
        return 0;
    }
}

async function getBlockUtilization() {
    try {
        const res = await fetch(ETH_RPC, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 1,
                method: 'eth_getBlockByNumber',
                params: ['latest', false]
            }),
            signal: AbortSignal.timeout(5000)
        });
        
        const data = await res.json();
        const block = data.result;
        const gasUsed = parseInt(block.gasUsed, 16);
        const gasLimit = parseInt(block.gasLimit, 16);
        
        return ((gasUsed / gasLimit) * 100).toFixed(1);
    } catch {
        return 0;
    }
}

export async function GET() {
    try {
        const [baseGas, utilization] = await Promise.all([
            getCurrentGasPrice(),
            getBlockUtilization()
        ]);

        const gas = {
            instant: (baseGas * 1.3).toFixed(1),
            fast: (baseGas * 1.15).toFixed(1),
            standard: baseGas.toFixed(1),
            slow: (baseGas * 0.85).toFixed(1)
        };

        const recommendation = 
            baseGas < 20 ? 'EXCELLENT' :
            baseGas < 40 ? 'GOOD' :
            baseGas < 80 ? 'NORMAL' :
            baseGas < 150 ? 'HIGH' : 'EXTREME';

        const usdEst = {
            transfer: (baseGas * 21000 / 1e9 * 3500).toFixed(2),
            swap: (baseGas * 150000 / 1e9 * 3500).toFixed(2),
            nft: (baseGas * 200000 / 1e9 * 3500).toFixed(2)
        };

        return Response.json({
            gas,
            utilization,
            recommendation,
            estimatedCost: usdEst,
            message: recommendation === 'EXCELLENT' ? 'Perfect time to transact!' :
                     recommendation === 'GOOD' ? 'Good time for transactions' :
                     recommendation === 'NORMAL' ? 'Average network activity' :
                     recommendation === 'HIGH' ? 'Consider waiting if not urgent' :
                     'Very high gas - wait if possible',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
