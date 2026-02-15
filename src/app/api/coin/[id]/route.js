import { generateCoinCommentary } from '@/lib/gemini-helper';
export const dynamic = 'force-dynamic';

const ALCHEMY_URL = `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;
const ALCHEMY_PRICES_URL = `https://api.g.alchemy.com/prices/v1/${process.env.ALCHEMY_API_KEY}/tokens/by-address`;
const ALCHEMY_PRICES_SYMBOL_URL = `https://api.g.alchemy.com/prices/v1/${process.env.ALCHEMY_API_KEY}/tokens/by-symbol`;

// Token map: CoinGecko id → contract address + symbol
const TOKEN_MAP = {
    'ethereum':             { address: null,                                           symbol: 'ETH',  name: 'Ethereum',        image: 'https://assets.coingecko.com/coins/images/279/thumb/ethereum.png' },
    'chainlink':            { address: '0x514910771af9ca656af840dff83e8264ecf986ca',   symbol: 'LINK', name: 'Chainlink',        image: 'https://assets.coingecko.com/coins/images/877/thumb/chainlink-new-logo.png' },
    'uniswap':              { address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',   symbol: 'UNI',  name: 'Uniswap',          image: 'https://assets.coingecko.com/coins/images/12504/thumb/uniswap-uni.png' },
    'aave':                 { address: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',   symbol: 'AAVE', name: 'Aave',             image: 'https://assets.coingecko.com/coins/images/12645/thumb/AAVE.png' },
    'maker':                { address: '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',   symbol: 'MKR',  name: 'Maker',            image: 'https://assets.coingecko.com/coins/images/1364/thumb/Mark_Maker.png' },
    'compound-governance-token': { address: '0xc00e94cb662c3520282e6f5717214004a7f26888', symbol: 'COMP', name: 'Compound',    image: 'https://assets.coingecko.com/coins/images/10775/thumb/COMP.png' },
    'dai':                  { address: '0x6b175474e89094c44da98b954eedeac495271d0f',   symbol: 'DAI',  name: 'Dai',              image: 'https://assets.coingecko.com/coins/images/9956/thumb/Badge_Dai.png' },
    'wrapped-bitcoin':      { address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',   symbol: 'WBTC', name: 'Wrapped Bitcoin',  image: 'https://assets.coingecko.com/coins/images/7598/thumb/wrapped_bitcoin_wbtc.png' },
    'shiba-inu':            { address: '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce',   symbol: 'SHIB', name: 'Shiba Inu',        image: 'https://assets.coingecko.com/coins/images/11939/thumb/shiba.png' },
    'pepe':                 { address: '0x6982508145454ce325ddbe47a25d4ec3d2311933',   symbol: 'PEPE', name: 'Pepe',             image: 'https://assets.coingecko.com/coins/images/29850/thumb/pepe-token.jpeg' },
    'lido-dao':             { address: '0x5a98fcbea516cf06857215779fd812ca3bef1b32',   symbol: 'LDO',  name: 'Lido DAO',         image: 'https://assets.coingecko.com/coins/images/13573/thumb/Lido_DAO.png' },
    'the-graph':            { address: '0xc944e90c64b2c07662a292be6244bdf05cda44a7',   symbol: 'GRT',  name: 'The Graph',        image: 'https://assets.coingecko.com/coins/images/13397/thumb/Graph_Token.png' },
    'decentraland':         { address: '0x0f5d2fb29fb7d3cfee444a200298f468908cc942',   symbol: 'MANA', name: 'Decentraland',     image: 'https://assets.coingecko.com/coins/images/878/thumb/decentraland-mana.png' },
    'the-sandbox':          { address: '0x3845badade8e6dff049820680d1f14bd3903a5d0',   symbol: 'SAND', name: 'The Sandbox',      image: 'https://assets.coingecko.com/coins/images/12129/thumb/sandbox_logo.jpg' },
    'usd-coin':             { address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',   symbol: 'USDC', name: 'USD Coin',         image: 'https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png' },
    'tether':               { address: '0xdac17f958d2ee523a2206206994597c13d831ec7',   symbol: 'USDT', name: 'Tether',           image: 'https://assets.coingecko.com/coins/images/325/thumb/Tether.png' },
    'ethereum-name-service':{ address: '0xc18360217d8f7ab5e7c516566761ea12ce7f9d72',   symbol: 'ENS',  name: 'ENS',              image: 'https://assets.coingecko.com/coins/images/19785/thumb/acatxTm8_400x400.jpg' },
    'curve-dao-token':      { address: '0xd533a949740bb3306d119cc777fa900ba034cd52',   symbol: 'CRV',  name: 'Curve DAO',        image: 'https://assets.coingecko.com/coins/images/12124/thumb/Curve.png' },
    'convex-finance':       { address: '0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b',   symbol: 'CVX',  name: 'Convex Finance',   image: 'https://assets.coingecko.com/coins/images/15585/thumb/convex.png' },
    'balancer':             { address: '0xba100000625a3754423978a60c9317c58a424e3d',   symbol: 'BAL',  name: 'Balancer',         image: 'https://assets.coingecko.com/coins/images/11683/thumb/Balancer.png' },
};

async function fetchAlchemyPrice(token) {
    try {
        if (!token.address) {
            // ETH - use symbol endpoint
            const res = await fetch(ALCHEMY_PRICES_SYMBOL_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ symbols: ['ETH'] }),
                cache: 'no-store'
            });
            const data = await res.json();
            return parseFloat(data.data?.[0]?.prices?.[0]?.value || 0);
        }
        const res = await fetch(ALCHEMY_PRICES_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ addresses: [{ network: 'eth-mainnet', address: token.address }] }),
            cache: 'no-store'
        });
        const data = await res.json();
        return parseFloat(data.data?.[0]?.prices?.[0]?.value || 0);
    } catch { return 0; }
}

// Binance symbol map for 24h change (no API key needed)
const BINANCE_SYMBOL_MAP = {
    'ethereum': 'ETHUSDT', 'wrapped-bitcoin': 'BTCUSDT', 'chainlink': 'LINKUSDT',
    'uniswap': 'UNIUSDT', 'aave': 'AAVEUSDT', 'maker': 'MKRUSDT',
    'compound-governance-token': 'COMPUSDT', 'shiba-inu': 'SHIBUSDT', 'pepe': 'PEPEUSDT',
    'lido-dao': 'LDOUSDT', 'the-graph': 'GRTUSDT', 'decentraland': 'MANAUSDT',
    'the-sandbox': 'SANDUSDT', 'curve-dao-token': 'CRVUSDT', 'convex-finance': 'CVXUSDT',
    'balancer': 'BALUSDT', 'ethereum-name-service': 'ENSUSDT',
};

async function fetchChange24h(coinId) {
    try {
        const binanceSymbol = BINANCE_SYMBOL_MAP[coinId];
        // Stablecoins: return 0 change
        if (!binanceSymbol) return { change24h: 0, marketCap: 0, volume24h: 0 };
        const res = await fetch(
            `https://api.binance.com/api/v3/ticker/24hr?symbol=${binanceSymbol}`,
            { cache: 'no-store', signal: AbortSignal.timeout(6000) }
        );
        if (!res.ok) return { change24h: 0, marketCap: 0, volume24h: 0 };
        const d = await res.json();
        return {
            change24h: parseFloat(d.priceChangePercent || 0),
            marketCap: 0, // Binance doesn't provide mcap, not critical for detail page
            volume24h: parseFloat(d.quoteVolume || 0),
        };
    } catch { return { change24h: 0, marketCap: 0, volume24h: 0 }; }
}

async function fetchOnChainData(address) {
    if (!address) return { transfers24h: 0, uniqueHolders: 0, largeTransfers: 0 };
    try {
        const res = await fetch(ALCHEMY_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0', id: 1,
                method: 'alchemy_getAssetTransfers',
                params: [{
                    fromBlock: 'earliest',
                    toBlock: 'latest',
                    contractAddresses: [address],
                    category: ['erc20'],
                    maxCount: '0x64',
                    order: 'desc'
                }]
            }),
            cache: 'no-store'
        });
        const data = await res.json();
        const transfers = data?.result?.transfers || [];

        // Count unique addresses
        const uniqueAddresses = new Set([
            ...transfers.map(t => t.from),
            ...transfers.map(t => t.to)
        ]);

        // Large transfers (> $10k equivalent)
        const largeTransfers = transfers.filter(t =>
            parseFloat(t.value || 0) > 1000
        ).length;

        return {
            transfers24h: transfers.length,
            uniqueHolders: uniqueAddresses.size,
            largeTransfers
        };
    } catch { return { transfers24h: 0, uniqueHolders: 0, largeTransfers: 0 }; }
}

async function fetchGasPrice() {
    try {
        const res = await fetch(ALCHEMY_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_gasPrice', params: [] }),
            cache: 'no-store'
        });
        const data = await res.json();
        return Math.round(parseInt(data?.result || '0x0', 16) / 1e9);
    } catch { return 0; }
}

function calculateSentiment(change24h, transfers, largeTransfers) {
    const priceMomentum = Math.max(0, Math.min(100, 50 + change24h * 3));
    const activityScore = Math.min(100, transfers * 5 + 10);
    const whaleScore = largeTransfers > 5 ? 70 : largeTransfers > 2 ? 55 : 40;
    return Math.round(priceMomentum * 0.5 + activityScore * 0.3 + whaleScore * 0.2);
}

export async function GET(request, { params }) {
    const { id } = params;
    const token = TOKEN_MAP[id];

    if (!token) {
        return Response.json({ error: `Token '${id}' not found` }, { status: 404 });
    }

    try {
        // Fetch all data in parallel
        const [price, cgData, onChain, gasPrice] = await Promise.all([
            fetchAlchemyPrice(token),
            fetchChange24h(id),
            fetchOnChainData(token.address),
            fetchGasPrice()
        ]);

        const sentiment = calculateSentiment(cgData.change24h, onChain.transfers24h, onChain.largeTransfers);
        const sentimentLevel = sentiment >= 70 ? 'BULLISH' : sentiment >= 55 ? 'SLIGHTLY BULLISH' : sentiment >= 45 ? 'NEUTRAL' : sentiment >= 30 ? 'SLIGHTLY BEARISH' : 'BEARISH';

        // AI commentary (non-blocking)
        let commentary = null;
        try {
            commentary = await generateCoinCommentary({
                name: token.name,
                symbol: token.symbol,
                price,
                change24h: cgData.change24h,
                sentiment,
                transfers24h: onChain.transfers24h
            });
        } catch { /* ignore */ }

        return Response.json({
            id,
            name: token.name,
            symbol: token.symbol,
            image: token.image,
            address: token.address,
            price,
            change24h: cgData.change24h,
            marketCap: cgData.marketCap,
            volume24h: cgData.volume24h,
            onChain: {
                transfers24h: onChain.transfers24h,
                uniqueAddresses: onChain.uniqueHolders,
                largeTransfers: onChain.largeTransfers,
                gasPrice,
                network: 'Ethereum Mainnet'
            },
            sentiment,
            sentimentLevel,
            commentary,
            dataSource: 'alchemy',
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Coin page error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}
