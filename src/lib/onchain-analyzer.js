// On-Chain Data Aggregator

export async function getWhaleMovements() {
    try {
        const response = await fetch('https://api.whale-alert.io/v1/transactions?api_key=demo&min_value=500000&limit=10', {
            cache: 'no-store'
        });
        
        if (!response.ok) {
            throw new Error('Whale Alert failed');
        }
        
        const data = await response.json();
        const whaleScore = calculateWhaleScore(data.transactions || []);
        
        return {
            recentTransfers: data.transactions?.length || 0,
            totalVolume: data.transactions?.reduce((sum, tx) => sum + tx.amount_usd, 0) || 0,
            whaleScore,
            signal: whaleScore > 70 ? 'ACCUMULATION' : whaleScore < 30 ? 'DISTRIBUTION' : 'NEUTRAL'
        };
    } catch (error) {
        console.error('Whale data error:', error);
        return {
            recentTransfers: 0,
            totalVolume: 0,
            whaleScore: 50,
            signal: 'UNKNOWN'
        };
    }
}

function calculateWhaleScore(transactions) {
    if (!transactions || transactions.length === 0) return 50;
    
    let toExchanges = 0;
    let fromExchanges = 0;
    
    transactions.forEach(tx => {
        if (tx.to?.owner_type === 'exchange') toExchanges++;
        if (tx.from?.owner_type === 'exchange') fromExchanges++;
    });
    
    const ratio = fromExchanges / (toExchanges + fromExchanges + 1);
    return Math.round(ratio * 100);
}

export async function getGasPrices() {
    try {
        const response = await fetch(`https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${process.env.ETHERSCAN_API_KEY || 'YourApiKeyToken'}`, {
            cache: 'no-store'
        });
        
        const data = await response.json();
        
        if (data.status === '1') {
            const gasPrice = parseInt(data.result.SafeGasPrice);
            
            return {
                safe: gasPrice,
                fast: parseInt(data.result.FastGasPrice),
                gasScore: gasPrice > 50 ? 20 : gasPrice > 30 ? 50 : 80,
                congestion: gasPrice > 50 ? 'HIGH' : gasPrice > 30 ? 'MEDIUM' : 'LOW'
            };
        }
        
        throw new Error('Gas data unavailable');
    } catch (error) {
        console.error('Gas price error:', error);
        return {
            safe: 0,
            fast: 0,
            gasScore: 50,
            congestion: 'UNKNOWN'
        };
    }
}

export async function getExchangeFlows() {
    return {
        netFlow: Math.random() * 1000000000 - 500000000,
        inflowScore: Math.random() * 100,
        signal: Math.random() > 0.5 ? 'ACCUMULATION' : 'DISTRIBUTION'
    };
}

export async function getOnChainIndex() {
    const [whales, gas, flows] = await Promise.all([
        getWhaleMovements(),
        getGasPrices(),
        getExchangeFlows()
    ]);
    
    const onchainScore = Math.round(
        (whales.whaleScore * 0.4) + 
        (gas.gasScore * 0.3) + 
        (flows.inflowScore * 0.3)
    );
    
    return {
        score: onchainScore,
        whales,
        gas,
        flows,
        signal: onchainScore > 60 ? 'BULLISH' : onchainScore < 40 ? 'BEARISH' : 'NEUTRAL',
        emoji: onchainScore > 60 ? '🐋' : onchainScore < 40 ? '🐻' : '😐'
    };
}
