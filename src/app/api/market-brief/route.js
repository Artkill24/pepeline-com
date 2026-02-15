export const dynamic = 'force-dynamic';
export const revalidate = 3600; // 1 hour

// Token list with Binance symbols for 24h change data
const TOKENS = [
    { id: 'ethereum',       symbol: 'ETH',  name: 'Ethereum',       binance: 'ETHUSDT',  image: 'https://assets.coingecko.com/coins/images/279/thumb/ethereum.png',          address: null },
    { id: 'wrapped-bitcoin',symbol: 'BTC',  name: 'Bitcoin',        binance: 'BTCUSDT',  image: 'https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png',             address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599' },
    { id: 'chainlink',      symbol: 'LINK', name: 'Chainlink',      binance: 'LINKUSDT', image: 'https://assets.coingecko.com/coins/images/877/thumb/chainlink-new-logo.png', address: '0x514910771af9ca656af840dff83e8264ecf986ca' },
    { id: 'uniswap',        symbol: 'UNI',  name: 'Uniswap',        binance: 'UNIUSDT',  image: 'https://assets.coingecko.com/coins/images/12504/thumb/uniswap-uni.png',      address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984' },
    { id: 'aave',           symbol: 'AAVE', name: 'Aave',           binance: 'AAVEUSDT', image: 'https://assets.coingecko.com/coins/images/12645/thumb/AAVE.png',             address: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9' },
    { id: 'shiba-inu',      symbol: 'SHIB', name: 'Shiba Inu',      binance: 'SHIBUSDT', image: 'https://assets.coingecko.com/coins/images/11939/thumb/shiba.png',            address: '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce' },
    { id: 'pepe',           symbol: 'PEPE', name: 'Pepe',           binance: 'PEPEUSDT', image: 'https://assets.coingecko.com/coins/images/29850/thumb/pepe-token.jpeg',      address: '0x6982508145454ce325ddbe47a25d4ec3d2311933' },
    { id: 'lido-dao',       symbol: 'LDO',  name: 'Lido DAO',       binance: 'LDOUSDT',  image: 'https://assets.coingecko.com/coins/images/13573/thumb/Lido_DAO.png',         address: '0x5a98fcbea516cf06857215779fd812ca3bef1b32' },
    { id: 'maker',          symbol: 'MKR',  name: 'Maker',          binance: 'MKRUSDT',  image: 'https://assets.coingecko.com/coins/images/1364/thumb/Mark_Maker.png',        address: '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2' },
    { id: 'the-graph',      symbol: 'GRT',  name: 'The Graph',      binance: 'GRTUSDT',  image: 'https://assets.coingecko.com/coins/images/13397/thumb/Graph_Token.png',      address: '0xc944e90c64b2c07662a292be6244bdf05cda44a7' },
    { id: 'curve-dao-token',symbol: 'CRV',  name: 'Curve DAO',      binance: 'CRVUSDT',  image: 'https://assets.coingecko.com/coins/images/12124/thumb/Curve.png',            address: '0xd533a949740bb3306d119cc777fa900ba034cd52' },
    { id: 'the-sandbox',    symbol: 'SAND', name: 'The Sandbox',    binance: 'SANDUSDT', image: 'https://assets.coingecko.com/coins/images/12129/thumb/sandbox_logo.jpg',     address: '0x3845badade8e6dff049820680d1f14bd3903a5d0' },
    { id: 'decentraland',   symbol: 'MANA', name: 'Decentraland',   binance: 'MANAUSDT', image: 'https://assets.coingecko.com/coins/images/878/thumb/decentraland-mana.png',  address: '0x0f5d2fb29fb7d3cfee444a200298f468908cc942' },
    { id: 'balancer',       symbol: 'BAL',  name: 'Balancer',       binance: 'BALUSDT',  image: 'https://assets.coingecko.com/coins/images/11683/thumb/Balancer.png',         address: '0xba100000625a3754423978a60c9317c58a424e3d' },
    { id: 'ethereum-name-service', symbol: 'ENS', name: 'ENS',     binance: 'ENSUSDT',  image: 'https://assets.coingecko.com/coins/images/19785/thumb/acatxTm8_400x400.jpg', address: '0xc18360217d8f7ab5e7c516566761ea12ce7f9d72' },
];

// Fetch 24h change data from Binance (free, no auth, generous rate limits)
async function fetchBinanceTickers() {
    try {
        const symbols = JSON.stringify(TOKENS.map(t => t.binance));
        const url = `https://api.binance.com/api/v3/ticker/24hr?symbols=${encodeURIComponent(symbols)}`;
        const res = await fetch(url, {
            cache: 'no-store',
            signal: AbortSignal.timeout(8000)
        });
        if (!res.ok) throw new Error(`Binance ${res.status}`);
        const data = await res.json();
        // Build a map: ETHUSDT → { priceChangePercent, lastPrice, quoteVolume }
        const map = {};
        for (const t of data) {
            map[t.symbol] = {
                price: parseFloat(t.lastPrice || 0),
                change24h: parseFloat(t.priceChangePercent || 0),
                volume: parseFloat(t.quoteVolume || 0)
            };
        }
        return map;
    } catch (e) {
        console.error('Binance tickers error:', e.message);
        return {};
    }
}

function generateAIBrief({ avgChange, positiveRatio, gainers, losers, marketMood }) {
    const lines = [];
    if (marketMood === 'Bullish') {
        lines.push(`Strong bull session today. ${Math.round(positiveRatio * 100)}% of tracked tokens are green with an average gain of +${avgChange.toFixed(2)}%.`);
    } else if (marketMood === 'Cautiously Bullish') {
        lines.push(`Solid green day across crypto. The market is showing healthy buying pressure with ${avgChange > 0 ? '+' : ''}${avgChange.toFixed(2)}% average movement.`);
    } else if (marketMood === 'Neutral') {
        lines.push(`Mixed market today. Roughly equal buying and selling pressure with average change at ${avgChange > 0 ? '+' : ''}${avgChange.toFixed(2)}%.`);
    } else if (marketMood === 'Cautiously Bearish') {
        lines.push(`Red-dominated session. Selling pressure visible with average losses around ${avgChange.toFixed(2)}%. Dip buyers watching closely.`);
    } else {
        lines.push(`Heavy selloff across the board. Average loss of ${avgChange.toFixed(2)}% signals broad market weakness.`);
    }
    if (gainers.length > 0) {
        const g = gainers[0];
        lines.push(`Top gainer: ${g.symbol} surging +${g.change24h.toFixed(2)}%.${gainers[1] ? ` ${gainers[1].symbol} also catching bids.` : ''}`);
    }
    if (losers.length > 0) {
        const l = losers[0];
        lines.push(`Weakest: ${l.symbol} bleeding ${l.change24h.toFixed(2)}%. Watch support levels.`);
    }
    if (marketMood === 'Bullish' || marketMood === 'Cautiously Bullish') {
        lines.push("Momentum is strong but don't ignore risk management. Trailing stops are your friend.");
    } else if (marketMood === 'Neutral') {
        lines.push('Consolidation phases often precede big moves. Set alerts and wait for breakouts.');
    } else {
        lines.push('Bear phases create the best long-term entry points. DCA into strength, not panic.');
    }
    return lines.join(' ');
}

export async function GET() {
    try {
        const tickers = await fetchBinanceTickers();

        const coins = TOKENS
            .map(t => ({
                id: t.id,
                symbol: t.symbol,
                name: t.name,
                image: t.image,
                price: tickers[t.binance]?.price || 0,
                change24h: tickers[t.binance]?.change24h || 0,
                volume: tickers[t.binance]?.volume || 0,
            }))
            .filter(c => c.price > 0);

        const gainers = [...coins].filter(c => c.change24h > 0).sort((a, b) => b.change24h - a.change24h).slice(0, 3);
        const losers  = [...coins].filter(c => c.change24h < 0).sort((a, b) => a.change24h - b.change24h).slice(0, 3);

        const totalPositive = coins.filter(c => c.change24h > 0).length;
        const totalNegative = coins.filter(c => c.change24h < 0).length;
        const avgChange = coins.reduce((sum, c) => sum + c.change24h, 0) / (coins.length || 1);
        const positiveRatio = totalPositive / (coins.length || 1);

        let marketMood, moodEmoji, moodDescription;
        if (positiveRatio > 0.8)      { marketMood = 'Bullish';           moodEmoji = '🚀'; moodDescription = 'Market is strongly green. Most coins pumping. Watch for FOMO tops.'; }
        else if (positiveRatio > 0.6) { marketMood = 'Cautiously Bullish'; moodEmoji = '📈'; moodDescription = 'Healthy green day. Good momentum without extreme euphoria.'; }
        else if (positiveRatio > 0.4) { marketMood = 'Neutral';           moodEmoji = '⚖️'; moodDescription = 'Mixed signals. Market digesting recent moves. Wait for clarity.'; }
        else if (positiveRatio > 0.2) { marketMood = 'Cautiously Bearish'; moodEmoji = '📉'; moodDescription = 'Red dominates. Selling pressure building. Be careful with new positions.'; }
        else                          { marketMood = 'Bearish';            moodEmoji = '💀'; moodDescription = 'Heavy selling across the board. Fear is high.'; }

        const brief = generateAIBrief({ avgChange, positiveRatio, gainers, losers, marketMood });

        return Response.json({
            mood: { label: marketMood, emoji: moodEmoji, description: moodDescription },
            stats: { totalCoins: coins.length, green: totalPositive, red: totalNegative, avgChange24h: Math.round(avgChange * 100) / 100 },
            topGainers: gainers,
            topLosers: losers,
            brief,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Market brief error:', error);
        return Response.json({ error: 'Failed' }, { status: 500 });
    }
}
