// Macro Economic Indicators

export async function getFearGreedIndex() {
    try {
        const response = await fetch('https://api.alternative.me/fng/?limit=1', {
            cache: 'no-store'
        });
        
        const data = await response.json();
        const fng = parseInt(data.data[0].value);
        
        return {
            value: fng,
            classification: data.data[0].value_classification,
            emoji: fng > 75 ? '🤑' : fng > 50 ? '😊' : fng > 25 ? '😐' : '😱'
        };
    } catch (error) {
        console.error('Fear & Greed error:', error);
        return {
            value: 50,
            classification: 'Neutral',
            emoji: '😐'
        };
    }
}

export async function getBitcoinDominance() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/global', {
            cache: 'no-store'
        });
        
        const data = await response.json();
        const btcDom = data.data.market_cap_percentage.btc;
        
        return {
            percentage: btcDom.toFixed(2),
            trend: btcDom > 55 ? 'BTC SEASON' : btcDom < 40 ? 'ALT SEASON' : 'MIXED',
            emoji: btcDom > 55 ? '₿' : '🚀'
        };
    } catch (error) {
        console.error('BTC Dominance error:', error);
        return {
            percentage: '50',
            trend: 'UNKNOWN',
            emoji: '❓'
        };
    }
}

export async function getTotalMarketCap() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/global', {
            cache: 'no-store'
        });
        
        const data = await response.json();
        const totalMcap = data.data.total_market_cap.usd;
        const change24h = data.data.market_cap_change_percentage_24h_usd;
        
        return {
            value: totalMcap,
            formatted: `$${(totalMcap / 1e12).toFixed(2)}T`,
            change24h: change24h.toFixed(2),
            emoji: change24h > 0 ? '📈' : '📉'
        };
    } catch (error) {
        console.error('Market cap error:', error);
        return {
            value: 0,
            formatted: '$0',
            change24h: '0',
            emoji: '😐'
        };
    }
}

export async function getMacroIndex() {
    const [fng, btcDom, mcap] = await Promise.all([
        getFearGreedIndex(),
        getBitcoinDominance(),
        getTotalMarketCap()
    ]);
    
    const macroScore = Math.round(
        (fng.value * 0.5) + 
        (parseFloat(mcap.change24h) > 0 ? 70 : 30) * 0.3 +
        (btcDom.percentage > 50 ? 60 : 40) * 0.2
    );
    
    return {
        score: macroScore,
        fng,
        btcDom,
        mcap,
        signal: macroScore > 60 ? 'BULLISH' : macroScore < 40 ? 'BEARISH' : 'NEUTRAL',
        emoji: macroScore > 60 ? '🚀' : macroScore < 40 ? '🐻' : '😐'
    };
}
