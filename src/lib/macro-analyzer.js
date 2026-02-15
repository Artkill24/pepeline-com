// Macro Economic Indicators — CoinGecko (cached) + alternative.me

const BTC_SUPPLY = 19_800_000;
const ETH_SUPPLY = 120_000_000;

// Shared in-memory cache for CoinGecko global (avoids duplicate calls)
let _cgCache = null;
let _cgCacheTime = 0;
const CG_TTL = 180_000; // 3 minutes

async function fetchCoinGeckoGlobal() {
    const now = Date.now();
    if (_cgCache && now - _cgCacheTime < CG_TTL) return _cgCache;
    try {
        const res = await fetch('https://api.coingecko.com/api/v3/global', {
            cache: 'no-store',
            headers: { 'Accept': 'application/json' },
            signal: AbortSignal.timeout(10000)
        });
        if (!res.ok) throw new Error(`CoinGecko ${res.status}`);
        const data = await res.json();
        if (!data?.data) throw new Error('Invalid response');
        _cgCache = data.data;
        _cgCacheTime = now;
        return _cgCache;
    } catch (e) {
        console.error('CoinGecko global fetch error:', e.message);
        return _cgCache || null;
    }
}

export async function getFearGreedIndex() {
    try {
        const res = await fetch('https://api.alternative.me/fng/?limit=1', {
            cache: 'no-store',
            signal: AbortSignal.timeout(8000)
        });
        const data = await res.json();
        const fng = parseInt(data?.data?.[0]?.value || 50);
        return {
            value: fng,
            classification: data?.data?.[0]?.value_classification || 'Neutral',
            emoji: fng > 75 ? '🤑' : fng > 50 ? '😊' : fng > 25 ? '😐' : '😱'
        };
    } catch (e) {
        console.error('Fear & Greed error:', e.message);
        return { value: 50, classification: 'Neutral', emoji: '😐' };
    }
}

export async function getBitcoinDominance() {
    try {
        const global = await fetchCoinGeckoGlobal();
        const btcDom = global?.market_cap_percentage?.btc;
        if (btcDom === undefined || btcDom === null) throw new Error('btc dom not found');
        return {
            percentage: parseFloat(btcDom).toFixed(2),
            trend: btcDom > 55 ? 'BTC SEASON' : btcDom < 40 ? 'ALT SEASON' : 'MIXED',
            emoji: btcDom > 55 ? '₿' : '🚀'
        };
    } catch (e) {
        console.error('BTC Dominance error:', e.message);
        return { percentage: '52', trend: 'MIXED', emoji: '₿' };
    }
}

export async function getTotalMarketCap() {
    try {
        const global = await fetchCoinGeckoGlobal();
        const totalMcap = global?.total_market_cap?.usd;
        const change24h = global?.market_cap_change_percentage_24h_usd;
        if (!totalMcap) throw new Error('mcap not found');
        const change = parseFloat(change24h || 0);
        return {
            value: totalMcap,
            formatted: `$${(totalMcap / 1e12).toFixed(2)}T`,
            change24h: change.toFixed(2),
            emoji: change > 0 ? '📈' : '📉'
        };
    } catch (e) {
        console.error('Market cap error:', e.message);
        return { value: 2.5e12, formatted: '$2.50T', change24h: '0', emoji: '😐' };
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
        score: Math.max(0, Math.min(100, macroScore)),
        fng, btcDom, mcap,
        signal: macroScore > 60 ? 'BULLISH' : macroScore < 40 ? 'BEARISH' : 'NEUTRAL',
        emoji: macroScore > 60 ? '🚀' : macroScore < 40 ? '🐻' : '😐'
    };
}
