import { calculateRiskScore } from '@/lib/gemini-risk-analyzer';

export const dynamic = 'force-dynamic';

export async function POST(request) {
    try {
        const body = await request.json();
        const { coins } = body; // array di { id, amount }

        if (!coins || coins.length === 0) {
            return Response.json({ error: 'No coins provided' }, { status: 400 });
        }

        const BINANCE_MAP = {
            'ethereum': { binance: 'ETHUSDT', name: 'Ethereum', symbol: 'ETH', image: 'https://assets.coingecko.com/coins/images/279/thumb/ethereum.png' },
            'bitcoin': { binance: 'BTCUSDT', name: 'Bitcoin', symbol: 'BTC', image: 'https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png' },
            'wrapped-bitcoin': { binance: 'WBTCUSDT', name: 'Wrapped Bitcoin', symbol: 'WBTC', image: 'https://assets.coingecko.com/coins/images/7598/thumb/wrapped_bitcoin_wbtc.png' },
            'chainlink': { binance: 'LINKUSDT', name: 'Chainlink', symbol: 'LINK', image: 'https://assets.coingecko.com/coins/images/877/thumb/chainlink-new-logo.png' },
            'uniswap': { binance: 'UNIUSDT', name: 'Uniswap', symbol: 'UNI', image: 'https://assets.coingecko.com/coins/images/12504/thumb/uniswap-uni.png' },
            'aave': { binance: 'AAVEUSDT', name: 'Aave', symbol: 'AAVE', image: 'https://assets.coingecko.com/coins/images/12645/thumb/AAVE.png' },
            'maker': { binance: 'MKRUSDT', name: 'Maker', symbol: 'MKR', image: 'https://assets.coingecko.com/coins/images/1364/thumb/Mark_Maker.png' },
            'shiba-inu': { binance: 'SHIBUSDT', name: 'Shiba Inu', symbol: 'SHIB', image: 'https://assets.coingecko.com/coins/images/11939/thumb/shiba.png' },
            'pepe': { binance: 'PEPEUSDT', name: 'Pepe', symbol: 'PEPE', image: 'https://assets.coingecko.com/coins/images/29850/thumb/pepe-token.jpeg' },
            'lido-dao': { binance: 'LDOUSDT', name: 'Lido DAO', symbol: 'LDO', image: 'https://assets.coingecko.com/coins/images/13573/thumb/Lido_DAO.png' },
            'the-graph': { binance: 'GRTUSDT', name: 'The Graph', symbol: 'GRT', image: 'https://assets.coingecko.com/coins/images/13397/thumb/Graph_Token.png' },
            'curve-dao-token': { binance: 'CRVUSDT', name: 'Curve DAO', symbol: 'CRV', image: 'https://assets.coingecko.com/coins/images/12124/thumb/Curve.png' },
            'solana': { binance: 'SOLUSDT', name: 'Solana', symbol: 'SOL', image: 'https://assets.coingecko.com/coins/images/4128/thumb/solana.png' },
        };

        // Fetch data per ogni coin via Binance (no API key, no rate limits)
        const coinResults = await Promise.all(
            coins.map(async (item) => {
                try {
                    const meta = BINANCE_MAP[item.id];
                    if (!meta) return null;

                    const res = await fetch(
                        `https://api.binance.com/api/v3/ticker/24hr?symbol=${meta.binance}`,
                        { cache: 'no-store', signal: AbortSignal.timeout(6000) }
                    );
                    if (!res.ok) return null;
                    const d = await res.json();

                    const price = parseFloat(d.lastPrice || 0);
                    const change24h = parseFloat(d.priceChangePercent || 0);
                    const change7d = 0;
                    const marketCap = 0;
                    const volume = parseFloat(d.quoteVolume || 0);

                    // Sentiment
                    let score = 50 + Math.min(Math.max(change24h * 2, -30), 30) + (Math.random() - 0.5) * 10;
                    score = Math.max(0, Math.min(100, score));
                    let level, emoji;
                    if (score < 20) { level = 'Calm'; emoji = '🟢'; }
                    else if (score < 40) { level = 'Neutral'; emoji = '🔵'; }
                    else if (score < 60) { level = 'Active'; emoji = '🟡'; }
                    else if (score < 80) { level = 'Hyped'; emoji = '🟠'; }
                    else { level = 'Peak Degen'; emoji = '🔴'; }

                    const coinData = { sentiment: score, change24h, change7d, marketCap, volume };
                    const risk = calculateRiskScore(coinData);

                    const totalValue = price * item.amount;

                    return {
                        id: item.id,
                        symbol: meta.symbol,
                        name: meta.name,
                        image: meta.image,
                        price,
                        amount: item.amount,
                        totalValue,
                        change24h,
                        change7d,
                        sentiment: Math.round(score * 100) / 100,
                        level,
                        emoji,
                        risk: risk.score,
                        riskLevel: risk.level
                    };
                } catch (e) {
                    return null;
                }
            })
        );

        const validCoins = coinResults.filter(Boolean);
        if (validCoins.length === 0) {
            return Response.json({ error: 'No valid coins found' }, { status: 400 });
        }

        // Portfolio stats
        const totalPortfolioValue = validCoins.reduce((sum, c) => sum + c.totalValue, 0);
        const weightedSentiment = validCoins.reduce((sum, c) => sum + (c.sentiment * c.totalValue), 0) / totalPortfolioValue;
        const weightedRisk = validCoins.reduce((sum, c) => sum + (c.risk * c.totalValue), 0) / totalPortfolioValue;
        const portfolio24h = validCoins.reduce((sum, c) => sum + (c.totalValue * c.change24h / 100), 0);
        const portfolio7d = validCoins.reduce((sum, c) => sum + (c.totalValue * c.change7d / 100), 0);

        // Allocazione % per coin
        validCoins.forEach(c => {
            c.allocation = Math.round((c.totalValue / totalPortfolioValue) * 1000) / 10;
        });

        // Sort by allocation
        validCoins.sort((a, b) => b.allocation - a.allocation);

        // Diversification score
        const maxAllocation = Math.max(...validCoins.map(c => c.allocation));
        let diversificationScore;
        if (validCoins.length === 1) diversificationScore = 10;
        else if (maxAllocation > 60) diversificationScore = 25;
        else if (maxAllocation > 40) diversificationScore = 50;
        else if (maxAllocation > 25) diversificationScore = 75;
        else diversificationScore = 95;

        // AI Recommendations
        const recommendations = generateRecommendations({
            validCoins, weightedSentiment, weightedRisk, diversificationScore, maxAllocation, totalPortfolioValue
        });

        // Sentiment level del portfolio
        let portfolioSentimentLevel, portfolioSentimentEmoji;
        if (weightedSentiment < 20) { portfolioSentimentLevel = 'Calm'; portfolioSentimentEmoji = '🟢'; }
        else if (weightedSentiment < 40) { portfolioSentimentLevel = 'Neutral'; portfolioSentimentEmoji = '🔵'; }
        else if (weightedSentiment < 60) { portfolioSentimentLevel = 'Active'; portfolioSentimentEmoji = '🟡'; }
        else if (weightedSentiment < 80) { portfolioSentimentLevel = 'Hyped'; portfolioSentimentEmoji = '🟠'; }
        else { portfolioSentimentLevel = 'Peak Degen'; portfolioSentimentEmoji = '🔴'; }

        // Risk level portfolio
        let portfolioRiskLevel, portfolioRiskEmoji;
        if (weightedRisk < 20) { portfolioRiskLevel = 'Low'; portfolioRiskEmoji = '🟢'; }
        else if (weightedRisk < 40) { portfolioRiskLevel = 'Moderate'; portfolioRiskEmoji = '🟡'; }
        else if (weightedRisk < 60) { portfolioRiskLevel = 'Elevated'; portfolioRiskEmoji = '🟠'; }
        else if (weightedRisk < 80) { portfolioRiskLevel = 'High'; portfolioRiskEmoji = '🔴'; }
        else { portfolioRiskLevel = 'Extreme'; portfolioRiskEmoji = '💀'; }

        return Response.json({
            coins: validCoins,
            stats: {
                totalValue: totalPortfolioValue,
                change24h: portfolio24h,
                change24hPercent: (portfolio24h / totalPortfolioValue) * 100,
                change7d: portfolio7d,
                change7dPercent: (portfolio7d / totalPortfolioValue) * 100
            },
            sentiment: {
                score: Math.round(weightedSentiment * 100) / 100,
                level: portfolioSentimentLevel,
                emoji: portfolioSentimentEmoji
            },
            risk: {
                score: Math.round(weightedRisk),
                level: portfolioRiskLevel,
                emoji: portfolioRiskEmoji
            },
            diversification: diversificationScore,
            recommendations,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Portfolio error:', error);
        return Response.json({ error: 'Analysis failed' }, { status: 500 });
    }
}

function generateRecommendations({ validCoins, weightedSentiment, weightedRisk, diversificationScore, maxAllocation, totalPortfolioValue }) {
    const recs = [];

    // Diversification
    if (diversificationScore < 50) {
        const dominant = validCoins[0];
        recs.push({
            type: 'warning',
            icon: '⚠️',
            title: 'Too Concentrated',
            text: `${dominant.symbol} is ${dominant.allocation}% of your portfolio. Consider spreading across more assets to reduce risk.`
        });
    } else if (diversificationScore >= 75) {
        recs.push({
            type: 'success',
            icon: '✅',
            title: 'Well Diversified',
            text: 'Your portfolio is nicely spread. No single coin dominates. Good risk management.'
        });
    }

    // Sentiment warning
    if (weightedSentiment > 70) {
        recs.push({
            type: 'warning',
            icon: '🔥',
            title: 'High Sentiment Alert',
            text: 'Your portfolio sentiment is elevated. Consider taking some profits on hyped coins before a potential correction.'
        });
    } else if (weightedSentiment < 30) {
        recs.push({
            type: 'info',
            icon: '💎',
            title: 'Fear Zone',
            text: 'Portfolio is in fear territory. This could be an accumulation opportunity if you believe in long-term value.'
        });
    }

    // Risk warning
    if (weightedRisk > 60) {
        recs.push({
            type: 'warning',
            icon: '🚨',
            title: 'High Risk Portfolio',
            text: 'Your average risk score is high. Consider adding stablecoins or large-cap assets to balance.'
        });
    } else if (weightedRisk < 25) {
        recs.push({
            type: 'success',
            icon: '🛡️',
            title: 'Low Risk Profile',
            text: 'Conservative portfolio with strong fundamentals. Room to add some higher-risk plays if desired.'
        });
    }

    // Top performer highlight
    const topPerformer = [...validCoins].sort((a, b) => b.change24h - a.change24h)[0];
    if (topPerformer && topPerformer.change24h > 3) {
        recs.push({
            type: 'info',
            icon: '🚀',
            title: `${topPerformer.symbol} Pumping`,
            text: `${topPerformer.symbol} is up +${topPerformer.change24h.toFixed(2)}% in 24h. Consider taking partial profits or setting a trailing stop.`
        });
    }

    // Worst performer
    const worstPerformer = [...validCoins].sort((a, b) => a.change24h - b.change24h)[0];
    if (worstPerformer && worstPerformer.change24h < -3) {
        recs.push({
            type: 'info',
            icon: '📉',
            title: `${worstPerformer.symbol} Under Pressure`,
            text: `${worstPerformer.symbol} is down ${worstPerformer.change24h.toFixed(2)}%. Check if fundamentals changed or if this is just market noise.`
        });
    }

    // Default if no recs
    if (recs.length === 0) {
        recs.push({
            type: 'success',
            icon: '👍',
            title: 'Portfolio Looks Healthy',
            text: 'Balanced risk, good diversification, and moderate sentiment. Keep monitoring and stay disciplined.'
        });
    }

    return recs;
}
