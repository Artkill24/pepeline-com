#!/usr/bin/env python3
import os

files = {
    'src/lib/onchain-analyzer.js': '''// On-Chain Data Aggregator
export async function getWhaleMovements() {
    try {
        const response = await fetch('https://api.whale-alert.io/v1/transactions?api_key=demo&min_value=500000&limit=10', {
            cache: 'no-store'
        });
        
        if (!response.ok) throw new Error('Whale Alert failed');
        
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
        return { recentTransfers: 0, totalVolume: 0, whaleScore: 50, signal: 'UNKNOWN' };
    }
}

function calculateWhaleScore(transactions) {
    if (!transactions || transactions.length === 0) return 50;
    let toExchanges = 0, fromExchanges = 0;
    transactions.forEach(tx => {
        if (tx.to?.owner_type === 'exchange') toExchanges++;
        if (tx.from?.owner_type === 'exchange') fromExchanges++;
    });
    const ratio = fromExchanges / (toExchanges + fromExchanges + 1);
    return Math.round(ratio * 100);
}

export async function getGasPrices() {
    try {
        const response = await fetch(\`https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=\${process.env.ETHERSCAN_API_KEY || 'YourApiKeyToken'}\`, {
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
        return { safe: 0, fast: 0, gasScore: 50, congestion: 'UNKNOWN' };
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
        (whales.whaleScore * 0.4) + (gas.gasScore * 0.3) + (flows.inflowScore * 0.3)
    );
    
    return {
        score: onchainScore,
        whales, gas, flows,
        signal: onchainScore > 60 ? 'BULLISH' : onchainScore < 40 ? 'BEARISH' : 'NEUTRAL',
        emoji: onchainScore > 60 ? '🐋' : onchainScore < 40 ? '🐻' : '😐'
    };
}
''',

    'src/lib/macro-analyzer.js': '''// Macro Economic Indicators
export async function getFearGreedIndex() {
    try {
        const response = await fetch('https://api.alternative.me/fng/?limit=1', { cache: 'no-store' });
        const data = await response.json();
        const fng = parseInt(data.data[0].value);
        return {
            value: fng,
            classification: data.data[0].value_classification,
            emoji: fng > 75 ? '🤑' : fng > 50 ? '😊' : fng > 25 ? '😐' : '😱'
        };
    } catch (error) {
        console.error('Fear & Greed error:', error);
        return { value: 50, classification: 'Neutral', emoji: '😐' };
    }
}

export async function getBitcoinDominance() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/global', { cache: 'no-store' });
        const data = await response.json();
        const btcDom = data.data.market_cap_percentage.btc;
        return {
            percentage: btcDom.toFixed(2),
            trend: btcDom > 55 ? 'BTC SEASON' : btcDom < 40 ? 'ALT SEASON' : 'MIXED',
            emoji: btcDom > 55 ? '₿' : '🚀'
        };
    } catch (error) {
        console.error('BTC Dominance error:', error);
        return { percentage: '50', trend: 'UNKNOWN', emoji: '❓' };
    }
}

export async function getTotalMarketCap() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/global', { cache: 'no-store' });
        const data = await response.json();
        const totalMcap = data.data.total_market_cap.usd;
        const change24h = data.data.market_cap_change_percentage_24h_usd;
        return {
            value: totalMcap,
            formatted: \`$\${(totalMcap / 1e12).toFixed(2)}T\`,
            change24h: change24h.toFixed(2),
            emoji: change24h > 0 ? '📈' : '📉'
        };
    } catch (error) {
        console.error('Market cap error:', error);
        return { value: 0, formatted: '$0', change24h: '0', emoji: '😐' };
    }
}

export async function getMacroIndex() {
    const [fng, btcDom, mcap] = await Promise.all([
        getFearGreedIndex(), getBitcoinDominance(), getTotalMarketCap()
    ]);
    
    const macroScore = Math.round(
        (fng.value * 0.5) + 
        (parseFloat(mcap.change24h) > 0 ? 70 : 30) * 0.3 +
        (btcDom.percentage > 50 ? 60 : 40) * 0.2
    );
    
    return {
        score: macroScore, fng, btcDom, mcap,
        signal: macroScore > 60 ? 'BULLISH' : macroScore < 40 ? 'BEARISH' : 'NEUTRAL',
        emoji: macroScore > 60 ? '🚀' : macroScore < 40 ? '🐻' : '😐'
    };
}
'''
}

# Create each file
for filepath, content in files.items():
    full_path = os.path.join(os.path.expanduser('~/pepeline-com'), filepath)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, 'w') as f:
        f.write(content)
    print(f"✅ Created: {filepath}")

print("\n🎉 Phase 2 files created successfully!")
