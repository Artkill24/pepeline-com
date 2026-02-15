export const dynamic = 'force-dynamic';
export const revalidate = 1800; // 30 min

// Top coins tracked via Binance (free, no auth)
const TOP_COINS = [
    { id: 'bitcoin',    symbol: 'BTC',  name: 'Bitcoin',    binance: 'BTCUSDT',  image: 'https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png' },
    { id: 'ethereum',   symbol: 'ETH',  name: 'Ethereum',   binance: 'ETHUSDT',  image: 'https://assets.coingecko.com/coins/images/279/thumb/ethereum.png' },
    { id: 'solana',     symbol: 'SOL',  name: 'Solana',     binance: 'SOLUSDT',  image: 'https://assets.coingecko.com/coins/images/4128/thumb/solana.png' },
    { id: 'chainlink',  symbol: 'LINK', name: 'Chainlink',  binance: 'LINKUSDT', image: 'https://assets.coingecko.com/coins/images/877/thumb/chainlink-new-logo.png' },
    { id: 'uniswap',    symbol: 'UNI',  name: 'Uniswap',    binance: 'UNIUSDT',  image: 'https://assets.coingecko.com/coins/images/12504/thumb/uniswap-uni.png' },
    { id: 'aave',       symbol: 'AAVE', name: 'Aave',       binance: 'AAVEUSDT', image: 'https://assets.coingecko.com/coins/images/12645/thumb/AAVE.png' },
    { id: 'shiba-inu',  symbol: 'SHIB', name: 'Shiba Inu',  binance: 'SHIBUSDT', image: 'https://assets.coingecko.com/coins/images/11939/thumb/shiba.png' },
    { id: 'pepe',       symbol: 'PEPE', name: 'Pepe',       binance: 'PEPEUSDT', image: 'https://assets.coingecko.com/coins/images/29850/thumb/pepe-token.jpeg' },
    { id: 'the-graph',  symbol: 'GRT',  name: 'The Graph',  binance: 'GRTUSDT',  image: 'https://assets.coingecko.com/coins/images/13397/thumb/Graph_Token.png' },
    { id: 'lido-dao',   symbol: 'LDO',  name: 'Lido DAO',   binance: 'LDOUSDT',  image: 'https://assets.coingecko.com/coins/images/13573/thumb/Lido_DAO.png' },
];

export async function GET() {
    try {
        const symbols = JSON.stringify(TOP_COINS.map(t => t.binance));
        const url = `https://api.binance.com/api/v3/ticker/24hr?symbols=${encodeURIComponent(symbols)}`;

        const res = await fetch(url, {
            cache: 'no-store',
            signal: AbortSignal.timeout(8000)
        });
        if (!res.ok) throw new Error(`Binance ${res.status}`);
        const tickers = await res.json();

        const tickerMap = {};
        for (const t of tickers) {
            tickerMap[t.symbol] = {
                price: parseFloat(t.lastPrice || 0),
                change24h: parseFloat(t.priceChangePercent || 0),
            };
        }

        const coinsWithSentiment = TOP_COINS.map(coin => {
            const ticker = tickerMap[coin.binance] || {};
            const change = ticker.change24h || 0;
            const price = ticker.price || 0;

            // Sentiment score: base 50, ±30 from price change, ±10 noise
            let score = 50 + Math.min(Math.max(change * 2, -30), 30) + (Math.random() - 0.5) * 10;
            score = Math.max(0, Math.min(100, score));

            let level, emoji;
            if (score < 20)      { level = 'Calm';       emoji = '🟢'; }
            else if (score < 40) { level = 'Neutral';    emoji = '🔵'; }
            else if (score < 60) { level = 'Active';     emoji = '🟡'; }
            else if (score < 80) { level = 'Hyped';      emoji = '🟠'; }
            else                 { level = 'Peak Degen'; emoji = '🔴'; }

            return {
                id: coin.id,
                symbol: coin.symbol,
                name: coin.name,
                image: coin.image,
                price,
                change24h: change,
                sentiment: Math.round(score * 100) / 100,
                level,
                emoji
            };
        }).filter(c => c.price > 0);

        return Response.json({ coins: coinsWithSentiment, timestamp: new Date().toISOString() });
    } catch (error) {
        console.error('Top coins error:', error);
        return Response.json({ error: 'Failed to fetch top coins' }, { status: 500 });
    }
}
