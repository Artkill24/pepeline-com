// Macro Economic Indicators — powered by Binance + alternative.me

const BTC_SUPPLY = 19_800_000;
const ETH_SUPPLY = 120_000_000;

let _priceCache = null;
let _priceCacheTime = 0;
const PRICE_TTL = 60_000;

async function fetchAlchemyPrices() {
    const now = Date.now();
    if (_priceCache && now - _priceCacheTime < PRICE_TTL) return _priceCache;
    try {
        const res = await fetch(
            'https://api.binance.com/api/v3/ticker/price?symbols=["BTCUSDT","ETHUSDT"]',
            { cache: 'no-store', signal: AbortSignal.timeout(15000) }
        );
        if (!res.ok) throw new Error(`Binance prices ${res.status}`);
        const data = await res.json();
        const priceMap = {};
        for (const item of data) {
            if (item.symbol === 'BTCUSDT') priceMap['BTC'] = parseFloat(item.price);
            if (item.symbol === 'ETHUSDT') priceMap['ETH'] = parseFloat(item.price);
        }
        _priceCache = priceMap;
        _priceCacheTime = now;
        return priceMap;
    } catch (e) {
        console.error('Prices fetch error:', e.message);
        return _priceCache || { BTC: 85000, ETH: 3200 };
    }
}

let _binanceCache = null;
let _binanceCacheTime = 0;
const BINANCE_TTL = 120_000;

async function fetchBinance24hChange() {
    const now = Date.now();
    if (_binanceCache && now - _binanceCacheTime < BINANCE_TTL) return _binanceCache;
    try {
        const res = await fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT',
            { cache: 'no-store', signal: AbortSignal.timeout(15000) });
        if (!res.ok) throw new Error(`Binance ${res.status}`);
        const data = await res.json();
        const result = { change24h: parseFloat(data.priceChangePercent || 0), volume24h: parseFloat(data.quoteVolume || 0) };
        _binanceCache = result;
        _binanceCacheTime = now;
        return result;
    } catch (e) {
        console.error('Binance 24h error:', e.message);
        return _binanceCache || { change24h: 0, volume24h: 0 };
    }
}

export async function getFearGreedIndex() {
    try {
        const res = await fetch('https://api.alternative.me/fng/?limit=1', { cache: 'no-store', signal: AbortSignal.timeout(15000) });
        const data = await res.json();
        const fng = parseInt(data?.data?.[0]?.value || 50);
        return { value: fng, classification: data?.data?.[0]?.value_classification || 'Neutral', emoji: fng > 75 ? '🤑' : fng > 50 ? '😊' : fng > 25 ? '😐' : '😱' };
    } catch (e) {
        return { value: 50, classification: 'Neutral', emoji: '😐' };
    }
}

export async function getBitcoinDominance() {
    try {
        const prices = await fetchAlchemyPrices();
        const btcPrice = prices.BTC || 0;
        const ethPrice = prices.ETH || 0;
        if (!btcPrice || !ethPrice) throw new Error('Missing prices');
        const btcMcap = btcPrice * BTC_SUPPLY;
        const ethMcap = ethPrice * ETH_SUPPLY;
        const approxTotal = btcMcap + ethMcap + (ethMcap * 1.5);
        const btcDom = (btcMcap / approxTotal) * 100;
        return { percentage: btcDom.toFixed(2), trend: btcDom > 55 ? 'BTC SEASON' : btcDom < 40 ? 'ALT SEASON' : 'MIXED', emoji: btcDom > 55 ? '₿' : '🚀', btcPrice, ethPrice };
    } catch (e) {
        return { percentage: '52', trend: 'MIXED', emoji: '₿', btcPrice: 0, ethPrice: 0 };
    }
}

export async function getTotalMarketCap() {
    try {
        const [prices, binance] = await Promise.all([fetchAlchemyPrices(), fetchBinance24hChange()]);
        const btcMcap = (prices.BTC || 0) * BTC_SUPPLY;
        const ethMcap = (prices.ETH || 0) * ETH_SUPPLY;
        const approxTotal = btcMcap + ethMcap + (ethMcap * 1.5);
        const change = binance.change24h;
        return { value: approxTotal, formatted: `$${(approxTotal / 1e12).toFixed(2)}T`, change24h: change.toFixed(2), emoji: change > 0 ? '📈' : '📉' };
    } catch (e) {
        return { value: 2.5e12, formatted: '$2.50T', change24h: '0', emoji: '😐' };
    }
}

export async function getMacroIndex() {
    const [fng, btcDom, mcap] = await Promise.all([getFearGreedIndex(), getBitcoinDominance(), getTotalMarketCap()]);
    const macroScore = Math.round((fng.value * 0.5) + (parseFloat(mcap.change24h) > 0 ? 70 : 30) * 0.3 + (parseFloat(btcDom.percentage) > 50 ? 60 : 40) * 0.2);
    return { score: Math.max(0, Math.min(100, macroScore)), fng, btcDom, mcap, signal: macroScore > 60 ? 'BULLISH' : macroScore < 40 ? 'BEARISH' : 'NEUTRAL', emoji: macroScore > 60 ? '🚀' : macroScore < 40 ? '🐻' : '😐' };
}
