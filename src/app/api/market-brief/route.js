export const dynamic = 'force-dynamic';

const ALCHEMY_URL = `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;
const TOKEN_LIST = [
    { id: 'ethereum',        symbol: 'ETH',  name: 'Ethereum',              address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', image: 'https://assets.coingecko.com/coins/images/279/thumb/ethereum.png' },
    { id: 'chainlink',       symbol: 'LINK', name: 'Chainlink',             address: '0x514910771af9ca656af840dff83e8264ecf986ca', image: 'https://assets.coingecko.com/coins/images/877/thumb/chainlink-new-logo.png' },
    { id: 'uniswap',         symbol: 'UNI',  name: 'Uniswap',               address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984', image: 'https://assets.coingecko.com/coins/images/12504/thumb/uniswap-uni.png' },
    { id: 'aave',            symbol: 'AAVE', name: 'Aave',                  address: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9', image: 'https://assets.coingecko.com/coins/images/12645/thumb/AAVE.png' },
    { id: 'maker',           symbol: 'MKR',  name: 'Maker',                 address: '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2', image: 'https://assets.coingecko.com/coins/images/1364/thumb/Mark_Maker.png' },
    { id: 'compound-governance-token', symbol: 'COMP', name: 'Compound', address: '0xc00e94cb662c3520282e6f5717214004a7f26888', image: 'https://assets.coingecko.com/coins/images/10775/thumb/COMP.png' },
    { id: 'dai',             symbol: 'DAI',  name: 'Dai',                   address: '0x6b175474e89094c44da98b954eedeac495271d0f', image: 'https://assets.coingecko.com/coins/images/9956/thumb/Badge_Dai.png' },
    { id: 'wrapped-bitcoin', symbol: 'WBTC', name: 'Wrapped Bitcoin',       address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', image: 'https://assets.coingecko.com/coins/images/7598/thumb/wrapped_bitcoin_wbtc.png' },
    { id: 'shiba-inu',       symbol: 'SHIB', name: 'Shiba Inu',             address: '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce', image: 'https://assets.coingecko.com/coins/images/11939/thumb/shiba.png' },
    { id: 'pepe',            symbol: 'PEPE', name: 'Pepe',                  address: '0x6982508145454ce325ddbe47a25d4ec3d2311933', image: 'https://assets.coingecko.com/coins/images/29850/thumb/pepe-token.jpeg' },
    { id: 'lido-dao',        symbol: 'LDO',  name: 'Lido DAO',              address: '0x5a98fcbea516cf06857215779fd812ca3bef1b32', image: 'https://assets.coingecko.com/coins/images/13573/thumb/Lido_DAO.png' },
    { id: 'the-graph',       symbol: 'GRT',  name: 'The Graph',             address: '0xc944e90c64b2c07662a292be6244bdf05cda44a7', image: 'https://assets.coingecko.com/coins/images/13397/thumb/Graph_Token.png' },
    { id: 'decentraland',    symbol: 'MANA', name: 'Decentraland',          address: '0x0f5d2fb29fb7d3cfee444a200298f468908cc942', image: 'https://assets.coingecko.com/coins/images/878/thumb/decentraland-mana.png' },
    { id: 'the-sandbox',     symbol: 'SAND', name: 'The Sandbox',           address: '0x3845badade8e6dff049820680d1f14bd3903a5d0', image: 'https://assets.coingecko.com/coins/images/12129/thumb/sandbox_logo.jpg' },
    { id: 'usd-coin',        symbol: 'USDC', name: 'USD Coin',              address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', image: 'https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png' },
    { id: 'tether',          symbol: 'USDT', name: 'Tether',                address: '0xdac17f958d2ee523a2206206994597c13d831ec7', image: 'https://assets.coingecko.com/coins/images/325/thumb/Tether.png' },
    { id: 'ethereum-name-service', symbol: 'ENS', name: 'ENS',             address: '0xc18360217d8f7ab5e7c516566761ea12ce7f9d72', image: 'https://assets.coingecko.com/coins/images/19785/thumb/acatxTm8_400x400.jpg' },
    { id: 'curve-dao-token', symbol: 'CRV',  name: 'Curve DAO',             address: '0xd533a949740bb3306d119cc777fa900ba034cd52', image: 'https://assets.coingecko.com/coins/images/12124/thumb/Curve.png' },
    { id: 'convex-finance',  symbol: 'CVX',  name: 'Convex Finance',        address: '0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b', image: 'https://assets.coingecko.com/coins/images/15585/thumb/convex.png' },
    { id: 'balancer',        symbol: 'BAL',  name: 'Balancer',              address: '0xba100000625a3754423978a60c9317c58a424e3d', image: 'https://assets.coingecko.com/coins/images/11683/thumb/Balancer.png' },
];

// Fetch prices AND 24h changes from CoinGecko simple/price (cached 5 min)
let _cgPriceCache = null;
let _cgPriceCacheTime = 0;
const CG_PRICE_TTL = 300_000; // 5 minutes

async function fetchCoinGeckoPricesAndChanges() {
    const now = Date.now();
    if (_cgPriceCache && now - _cgPriceCacheTime < CG_PRICE_TTL) {
        return _cgPriceCache;
    }
    try {
        const ids = TOKEN_LIST.map(t => t.id).join(',');
        const res = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`,
            { cache: 'no-store', signal: AbortSignal.timeout(12000) }
        );
        if (!res.ok) throw new Error(`CoinGecko ${res.status}`);
        const data = await res.json();

        const priceMap = {};
        const changeMap = {};
        for (const token of TOKEN_LIST) {
            const d = data[token.id];
            priceMap[token.id] = parseFloat(d?.usd || 0);
            changeMap[token.id] = parseFloat(d?.usd_24h_change || 0);
        }
        const result = { priceMap, changeMap };
        _cgPriceCache = result;
        _cgPriceCacheTime = now;
        return result;
    } catch (e) {
        console.error('CoinGecko prices error:', e.message);
        return _cgPriceCache || { priceMap: {}, changeMap: {} };
    }
}
// Fetch 24h transfer count from Alchemy
async function fetchTransfers(address) {
    try {
        if (address.includes('eeeeeeee')) return 0;
        const yesterday = Math.floor((Date.now() - 86400000) / 1000);
        const res = await fetch(ALCHEMY_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0', id: 1,
                method: 'alchemy_getAssetTransfers',
                params: [{
                    fromBlock: `0x${yesterday.toString(16)}`,
                    toBlock: 'latest',
                    contractAddresses: [address],
                    category: ['erc20'],
                    maxCount: '0x64'
                }]
            }),
            cache: 'no-store'
        });
        const data = await res.json();
        return data?.result?.transfers?.length || 0;
    } catch {
        return 0;
    }
}

function calculateSentiment(priceChange, transfers) {
    const priceMomentum = Math.max(0, Math.min(100, 50 + priceChange * 3));
    const activityScore = Math.min(100, transfers * 5 + 10);
    return Math.round(priceMomentum * 0.6 + activityScore * 0.4);
}

function getSentimentLevel(score) {
    if (score >= 70) return { level: 'Bullish', emoji: '🟢' };
    if (score >= 55) return { level: 'Slightly Bullish', emoji: '🔵' };
    if (score >= 45) return { level: 'Neutral', emoji: '🔵' };
    if (score >= 30) return { level: 'Slightly Bearish', emoji: '🟡' };
    return { level: 'Bearish', emoji: '🔴' };
}

export async function GET() {
    try {
        // Fetch prices + changes from CoinGecko (cached 5min) + on-chain transfers from Alchemy
        const [{ priceMap, changeMap }, transferResults] = await Promise.all([
            fetchCoinGeckoPricesAndChanges(),
            Promise.all(TOKEN_LIST.slice(0, 8).map(t => fetchTransfers(t.address)))
        ]);

        const coins = TOKEN_LIST.map((token, i) => {
            const change24h = changeMap[token.id] || 0;
            const price = priceMap[token.id] || 0;

            const transfers = i < 8 ? (transferResults[i] || 0) : 0;
            const sentiment = calculateSentiment(change24h, transfers);
            const { level, emoji } = getSentimentLevel(sentiment);

            return {
                id: token.id,
                symbol: token.symbol,
                name: token.name,
                image: token.image,
                address: token.address,
                price,
                change24h,
                transfers24h: transfers,
                volume24h: 0,
                sentiment,
                level,
                emoji,
                dataSource: 'alchemy'
            };
        });

        const bullish = coins.filter(c => c.change24h > 2).length;
        const bearish = coins.filter(c => c.change24h < -2).length;
        const neutral = coins.length - bullish - bearish;

        return Response.json({
            coins,
            stats: { total: coins.length, bullish, bearish, neutral },
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('All-coins error:', error);
        return Response.json({ coins: [], stats: {}, error: error.message }, { status: 500 });
    }
}
