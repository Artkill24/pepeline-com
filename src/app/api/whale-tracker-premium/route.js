export const dynamic = 'force-dynamic';
import { getTopSmartWallets } from '@/lib/smart-wallets';

const ALCHEMY_KEY = process.env.ALCHEMY_API_KEY;
const ETH_RPC = `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`;

async function getWalletBalance(address) {
    try {
        const res = await fetch(ETH_RPC, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 1,
                method: 'eth_getBalance',
                params: [address, 'latest']
            }),
            signal: AbortSignal.timeout(5000)
        });
        
        const data = await res.json();
        const balanceWei = parseInt(data.result, 16);
        return (balanceWei / 1e18).toFixed(4);
    } catch {
        return 0;
    }
}

async function getRecentTransfers(address) {
    try {
        const res = await fetch(ETH_RPC, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 1,
                method: 'alchemy_getAssetTransfers',
                params: [{
                    fromAddress: address,
                    category: ['external', 'erc20'],
                    maxCount: '0xa',
                    excludeZeroValue: true
                }]
            }),
            signal: AbortSignal.timeout(5000)
        });
        
        const data = await res.json();
        return data.result?.transfers || [];
    } catch {
        return [];
    }
}

async function getTokenBalances(address) {
    try {
        const res = await fetch(ETH_RPC, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 1,
                method: 'alchemy_getTokenBalances',
                params: [address]
            }),
            signal: AbortSignal.timeout(5000)
        });
        
        const data = await res.json();
        return data.result?.tokenBalances?.length || 0;
    } catch {
        return 0;
    }
}

export async function GET() {
    try {
        const wallets = getTopSmartWallets('ethereum');
        
        const enrichedWallets = await Promise.all(
            wallets.map(async wallet => {
                const [balance, transfers, tokenCount] = await Promise.all([
                    getWalletBalance(wallet.address),
                    getRecentTransfers(wallet.address),
                    getTokenBalances(wallet.address)
                ]);
                
                const last24hTransfers = transfers.filter(t => {
                    const blockTime = new Date(t.metadata?.blockTimestamp);
                    const now = new Date();
                    return (now - blockTime) < 86400000;
                });

                return {
                    ...wallet,
                    ethBalance: balance,
                    tokenCount,
                    recentActivity: {
                        last24h: last24hTransfers.length,
                        last10Txs: transfers.length,
                        lastTx: transfers[0]?.hash || null
                    },
                    signal: last24hTransfers.length > 5 ? 'VERY_ACTIVE' : 
                            last24hTransfers.length > 2 ? 'ACTIVE' : 'QUIET'
                };
            })
        );

        const veryActive = enrichedWallets.filter(w => w.signal === 'VERY_ACTIVE');
        
        return Response.json({
            wallets: enrichedWallets,
            stats: {
                total: enrichedWallets.length,
                veryActive: veryActive.length,
                avgEthBalance: (enrichedWallets.reduce((sum, w) => sum + parseFloat(w.ethBalance), 0) / enrichedWallets.length).toFixed(2),
                totalActivity24h: enrichedWallets.reduce((sum, w) => sum + w.recentActivity.last24h, 0)
            },
            alerts: veryActive.map(w => ({
                wallet: w.label,
                address: w.address,
                activity: w.recentActivity.last24h,
                message: `${w.label} made ${w.recentActivity.last24h} transactions in 24h`
            })),
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
