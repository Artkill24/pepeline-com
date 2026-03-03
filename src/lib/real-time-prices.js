/**
 * Real-time Crypto Prices
 * FREE APIs - No auth needed
 */

// CoinGecko - FREE tier
export async function getCurrentPrice(coinId = 'bitcoin') {
    try {
        const res = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true`,
            { next: { revalidate: 60 } } // Cache 1 min
        );
        
        const data = await res.json();
        
        return {
            price: data[coinId]?.usd || 0,
            change24h: data[coinId]?.usd_24h_change || 0
        };
    } catch (error) {
        console.error('Price fetch error:', error);
        return { price: 0, change24h: 0 };
    }
}

// CoinGecko mapping
const COIN_IDS = {
    'BTC': 'bitcoin',
    'ETH': 'ethereum',
    'SOL': 'solana',
    'BNB': 'binancecoin',
    'DOGE': 'dogecoin',
    'ADA': 'cardano',
    'XRP': 'ripple',
    'MATIC': 'matic-network',
    'AVAX': 'avalanche-2',
    'DOT': 'polkadot',
    'LINK': 'chainlink',
    'UNI': 'uniswap',
    'ATOM': 'cosmos',
    'LTC': 'litecoin'
};

export async function getCoinPrice(symbol) {
    const coinId = COIN_IDS[symbol.toUpperCase()];
    if (!coinId) return { price: 0, change24h: 0 };
    
    return getCurrentPrice(coinId);
}

// Binance - Backup (più veloce ma solo prezzi)
export async function getBinancePrice(symbol = 'BTCUSDT') {
    try {
        const res = await fetch(
            `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`,
            { next: { revalidate: 30 } }
        );
        
        const data = await res.json();
        
        return {
            price: parseFloat(data.lastPrice),
            change24h: parseFloat(data.priceChangePercent)
        };
    } catch (error) {
        return { price: 0, change24h: 0 };
    }
}
