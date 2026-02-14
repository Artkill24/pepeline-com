// Macro Economic Indicators

export async function getFearGreedIndex() {
    try {
        const response = await fetch('https://api.alternative.me/fng/?limit=1', {
            cache: 'no-store'
        });
        const data = await response.json();
        const fng = parseInt(data?.data?.[0]?.value || 50);
        return {
            value: fng,
            classification: data?.data?.[0]?.value_classification || 'Neutral',
            emoji: fng > 75 ? '🤑' : fng > 50 ? '😊' : fng > 25 ? '😐' : '😱'
        };
    } catch (error) {
        console.error('Fear & Greed error:', error.message);
        return { value: 50, classification: 'Neutral', emoji: '😐' };
    }
}

export async function getBitcoinDominance() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/global', {
            cache: 'no-store',
            headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) throw new Error(`CoinGecko status: ${response.status}`);

        const data = await response.json();

        // Safe nested access
        const btcDom = data?.data?.market_cap_percentage?.btc;
        if (btcDom === undefined || btcDom === null) {
            throw new Error('market_cap_percentage.btc not found');
        }

        return {
            percentage: parseFloat(btcDom).toFixed(2),
            trend: btcDom > 55 ? 'BTC SEASON' : btcDom < 40 ? 'ALT SEASON' : 'MIXED',
            emoji: btcDom > 55 ? '₿' : '🚀'
        };
    } catch (error) {
        console.error('BTC Dominance error:', error.message);
        return { percentage: '52', trend: 'MIXED', emoji: '₿' };
    }
}

export async function getTotalMarketCap() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/global', {
            cache: 'no-store',
            headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) throw new Error(`CoinGecko status: ${response.status}`);

        const data = await response.json();

        // Safe nested access
        const totalMcap = data?.data?.total_market_cap?.usd;
        const change24h = data?.data?.market_cap_change_percentage_24h_usd;

        if (totalMcap === undefined || totalMcap === null) {
            throw new Error('total_market_cap.usd not found');
        }

        const change = parseFloat(change24h || 0);

        return {
            value: totalMcap,
            formatted: `$${(totalMcap / 1e12).toFixed(2)}T`,
            change24h: change.toFixed(2),
            emoji: change > 0 ? '📈' : '📉'
        };
    } catch (error) {
        console.error('Market cap error:', error.message);
        return {
            value: 2.5e12,
            formatted: '$2.50T',
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
        (parseFloat(btcDom.percentage) > 50 ? 60 : 40) * 0.2
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
