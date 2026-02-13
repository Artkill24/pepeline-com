export const dynamic = 'force-dynamic';

const ALCHEMY_URL = `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;
const ALCHEMY_PRICES_URL = `https://api.g.alchemy.com/prices/v1/${process.env.ALCHEMY_API_KEY}/tokens/by-address`;

// Top ERC-20 token contract addresses on Ethereum
const TOKEN_LIST = [
    { id: 'ethereum',   symbol: 'ETH',   name: 'Ethereum',       address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', image: 'https://assets.coingecko.com/coins/images/279/thumb/ethereum.png' },
    { id: 'chainlink',  symbol: 'LINK',  name: 'Chainlink',      address: '0x514910771af9ca656af840dff83e8264ecf986ca', image: 'https://assets.coingecko.com/coins/images/877/thumb/chainlink-new-logo.png' },
    { id: 'uniswap',    symbol: 'UNI',   name: 'Uniswap',        address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984', image: 'https://assets.coingecko.com/coins/images/12504/thumb/uniswap-uni.png' },
    { id: 'aave',       symbol: 'AAVE',  name: 'Aave',           address: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9', image: 'https://assets.coingecko.com/coins/images/12645/thumb/AAVE.png' },
    { id: 'maker',      symbol: 'MKR',   name: 'Maker',          address: '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2', image: 'https://assets.coingecko.com/coins/images/1364/thumb/Mark_Maker.png' },
    { id: 'compound',   symbol: 'COMP',  name: 'Compound',       address: '0xc00e94cb662c3520282e6f5717214004a7f26888', image: 'https://assets.coingecko.com/coins/images/10775/thumb/COMP.png' },
    { id: 'dai',        symbol: 'DAI',   name: 'Dai',            address: '0x6b175474e89094c44da98b954eedeac495271d0f', image: 'https://assets.coingecko.com/coins/images/9956/thumb/Badge_Dai.png' },
    { id: 'wrapped-bitcoin', symbol: 'WBTC', name: 'Wrapped Bitcoin', address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', image: 'https://assets.coingecko.com/coins/images/7598/thumb/wrapped_bitcoin_wbtc.png' },
    { id: 'shiba-inu',  symbol: 'SHIB',  name: 'Shiba Inu',      address: '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce', image: 'https://assets.coingecko.com/coins/images/11939/thumb/shiba.png' },
    { id: 'pepe',       symbol: 'PEPE',  name: 'Pepe',           address: '0x6982508145454ce325ddbe47a25d4ec3d2311933', image: 'https://assets.coingecko.com/coins/images/29850/thumb/pepe-token.jpeg' },
    { id: 'lido-dao',   symbol: 'LDO',   name: 'Lido DAO',       address: '0x5a98fcbea516cf06857215779fd812ca3bef1b32', image: 'https://assets.coingecko.com/coins/images/13573/thumb/Lido_DAO.png' },
    { id: 'the-graph',  symbol: 'GRT',   name: 'The Graph',      address: '0xc944e90c64b2c07662a292be6244bdf05cda44a7', image: 'https://assets.coingecko.com/coins/images/13397/thumb/Graph_Token.png' },
    { id: 'decentraland', symbol: 'MANA', name: 'Decentraland',  address: '0x0f5d2fb29fb7d3cfee444a200298f468908cc942', image: 'https://assets.coingecko.com/coins/images/878/thumb/decentraland-mana.png' },
    { id: 'sandbox',    symbol: 'SAND',  name: 'The Sandbox',    address: '0x3845badade8e6dff049820680d1f14bd3903a5d0', image: 'https://assets.coingecko.com/coins/images/12129/thumb/sandbox_logo.jpg' },
    { id: 'usdc',       symbol: 'USDC',  name: 'USD Coin',       address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', image: 'https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png' },
    { id: 'tether',     symbol: 'USDT',  name: 'Tether',         address: '0xdac17f958d2ee523a2206206994597c13d831ec7', image: 'https://assets.coingecko.com/coins/images/325/thumb/Tether.png' },
    { id: 'ens',        symbol: 'ENS',   name: 'Ethereum Name Service', address: '0xc18360217d8f7ab5e7c516566761ea12ce7f9d72', image: 'https://assets.coingecko.com/coins/images/19785/thumb/acatxTm8_400x400.jpg' },
    { id: 'curve-dao-token', symbol: 'CRV', name: 'Curve DAO',  address: '0xd533a949740bb3306d119cc777fa900ba034cd52', image: 'https://assets.coingecko.com/coins/images/12124/thumb/Curve.png' },
    { id: 'convex-finance', symbol: 'CVX', name: 'Convex Finance', address: '0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b', image: 'https://assets.coingecko.com/coins/images/15585/thumb/convex.png' },
    { id: 'balancer',   symbol: 'BAL',   name: 'Balancer',       address: '0xba100000625a3754423978a60c9317c58a424e3d', image: 'https://assets.coingecko.com/coins/images/11683/thumb/Balancer.png' },
];

// Fetch prices from Alchemy Prices API
async function fetchAlchemyPrices(addresses) {
    try {
        const validAddresses = addresses.filter(a => !a.includes('eeeeeeee'));
        const body = validAddresses.map(address => ({
            network: 'eth-mainnet',
            address
        }));

        const res = await fetch(ALCHEMY_PRICES_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ addresses: body }),
            next: { revalidate: 60 }
        });

        if (!res.ok) return {};

        const data = await res.json();
        const priceMap = {};

        data.data?.forEach(item => {
            if (item.prices?.[0]) {
                priceMap[item.address.toLowerCase()] = {
                    price: parseFloat(item.prices[0].value || 0),
                    change24h: parseFloat(item.prices[0].percentChange24h || 0)
                };
            }
        });

        return priceMap;
    } catch (err) {
        console.error('Alchemy prices error:', err.message);
        return {};
    }
}

// Fetch 24h transfer count for on-chain activity score
async function fetchTransferActivity(address) {
    try {
        if (address.includes('eeeeeeee')) return { transfers: 0, volume: 0 };

        const res = await fetch(ALCHEMY_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 1,
                method: 'alchemy_getAssetTransfers',
                params: [{
                    fromBlock: 'latest',
                    toBlock: 'latest',
                    contractAddresses: [address],
                    category: ['erc20'],
                    maxCount: '0x14',
                    order: 'desc',
                    withMetadata: false,
                    excludeZeroValue: true
                }]
            }),
            next: { revalidate: 120 }
        });

        const data = await res.json();
        const transfers = data.result?.transfers || [];
        const volume = transfers.reduce((sum, tx) => sum + parseFloat(tx.value || 0), 0);

        return { transfers: transfers.length, volume };
    } catch {
        return { transfers: 0, volume: 0 };
    }
}

// Compute sentiment from on-chain signals
function computeOnChainSentiment(priceChange, transfers, volume) {
    // Price momentum (40%)
    const priceScore = Math.max(0, Math.min(100, 50 + priceChange * 3));

    // Transfer activity (40%) - more transfers = more activity = higher score
    const activityScore = Math.min(100, transfers * 5 + 10);

    // Volume score (20%)
    const volumeScore = volume > 1000 ? 80 : volume > 100 ? 60 : volume > 10 ? 40 : 20;

    const total = priceScore * 0.4 + activityScore * 0.4 + volumeScore * 0.2;
    return Math.round(Math.max(0, Math.min(100, total)));
}

function getLevel(score) {
    if (score >= 80) return { level: 'Peak Degen', emoji: '🔴' };
    if (score >= 60) return { level: 'Hyped', emoji: '🟠' };
    if (score >= 40) return { level: 'Active', emoji: '🟡' };
    if (score >= 20) return { level: 'Neutral', emoji: '🔵' };
    return { level: 'Calm', emoji: '🟢' };
}

export async function GET() {
    try {
        // Fetch prices for all tokens
        const addresses = TOKEN_LIST.map(t => t.address);
        const priceMap = await fetchAlchemyPrices(addresses);

        // Fetch activity for top 10 tokens (to avoid rate limits)
        const activityPromises = TOKEN_LIST.slice(0, 10).map(t =>
            fetchTransferActivity(t.address).then(a => ({ address: t.address.toLowerCase(), ...a }))
        );
        const activities = await Promise.all(activityPromises);
        const activityMap = {};
        activities.forEach(a => { activityMap[a.address] = a; });

        // Build coin list
        const coins = TOKEN_LIST.map(token => {
            const priceData = priceMap[token.address.toLowerCase()] || { price: 0, change24h: 0 };
            const activity = activityMap[token.address.toLowerCase()] || { transfers: 0, volume: 0 };

            const sentiment = computeOnChainSentiment(
                priceData.change24h,
                activity.transfers,
                activity.volume
            );

            const { level, emoji } = getLevel(sentiment);

            return {
                id: token.id,
                symbol: token.symbol,
                name: token.name,
                image: token.image,
                address: token.address,
                price: priceData.price,
                change24h: priceData.change24h,
                transfers24h: activity.transfers,
                volume24h: activity.volume,
                sentiment,
                level,
                emoji,
                dataSource: 'alchemy'
            };
        });

        // Sort by sentiment desc
        coins.sort((a, b) => b.sentiment - a.sentiment);

        return Response.json({
            coins,
            total: coins.length,
            timestamp: new Date().toISOString(),
            source: 'alchemy-onchain'
        });

    } catch (error) {
        console.error('All coins error:', error);
        return Response.json({ coins: [], error: error.message }, { status: 500 });
    }
}
