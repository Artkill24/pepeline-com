export const dynamic = 'force-dynamic';

const COIN_PAIRS = {
    BTC: 'btc_usdt', ETH: 'eth_usdt', SOL: 'sol_usdt', BNB: 'bnb_usdt',
    XRP: 'xrp_usdt', DOGE: 'doge_usdt', ADA: 'ada_usdt', AVAX: 'avax_usdt',
    LINK: 'link_usdt', MATIC: 'matic_usdt', DOT: 'dot_usdt', UNI: 'uni_usdt',
    ATOM: 'atom_usdt', LTC: 'ltc_usdt', NEAR: 'near_usdt'
};

async function generateCoinSignal(symbol, baseUrl) {
    const pair = COIN_PAIRS[symbol];
    if (!pair) return null;
    
    try {
        const [indexRes, metricsRes, priceRes] = await Promise.all([
            fetch(`${baseUrl}/api/index`, { cache: 'no-store', signal: AbortSignal.timeout(8000) }),
            fetch(`${baseUrl}/api/advanced-metrics`, { cache: 'no-store', signal: AbortSignal.timeout(8000) }),
            fetch(`${baseUrl}/api/supra-prices?pair=${pair}`, { cache: 'no-store', signal: AbortSignal.timeout(8000) })
        ]);

        const index = await indexRes.json();
        const metrics = await metricsRes.json();
        const priceData = await priceRes.json();

        if (!index?.index || !metrics || !priceData?.price) return null;

        const indexValue = index.index;
        const whaleSignal = metrics?.onchain?.whales?.signal || 'NEUTRAL';
        const alphaScore = metrics?.alphaScore || 50;
        const volumeRatio = Math.abs(priceData.change24h || 0) * 2;

        let finalSignal = 'HOLD', finalStrength = 0, confidence = 'LOW';

        // Strong BUY conditions
        if (indexValue <= 20 && whaleSignal === 'ACCUMULATION') {
            finalSignal = 'BUY';
            finalStrength = Math.round((20 - indexValue) * 4);
            confidence = 'HIGH';
        } else if (indexValue <= 25 && whaleSignal === 'ACCUMULATION') {
            finalSignal = 'BUY';
            finalStrength = Math.round((25 - indexValue) * 3);
            confidence = 'MEDIUM';
        } else if (indexValue <= 30 && priceData.change24h < -8) {
            finalSignal = 'BUY';
            finalStrength = Math.round((30 - indexValue) * 2 + Math.abs(priceData.change24h));
            confidence = 'MEDIUM';
        } else if (indexValue <= 35 && priceData.change24h < -5) {
            finalSignal = 'BUY';
            finalStrength = Math.round((35 - indexValue) * 1.5);
            confidence = 'LOW';
        }
        
        // Strong SELL conditions
        else if (indexValue >= 80 && whaleSignal === 'DISTRIBUTION') {
            finalSignal = 'SELL';
            finalStrength = Math.round((indexValue - 80) * 4);
            confidence = 'HIGH';
        } else if (indexValue >= 75 && whaleSignal === 'DISTRIBUTION') {
            finalSignal = 'SELL';
            finalStrength = Math.round((indexValue - 75) * 3);
            confidence = 'MEDIUM';
        } else if (indexValue >= 70 && priceData.change24h > 15) {
            finalSignal = 'SELL';
            finalStrength = Math.round((indexValue - 70) * 2 + priceData.change24h);
            confidence = 'MEDIUM';
        } else if (indexValue >= 65 && priceData.change24h > 10) {
            finalSignal = 'SELL';
            finalStrength = Math.round((indexValue - 65) * 1.5);
            confidence = 'LOW';
        }

        const allocation = confidence === 'HIGH' ? 70 : confidence === 'MEDIUM' ? 50 : 25;

        return {
            symbol,
            signal: finalSignal,
            strength: Math.min(100, finalStrength),
            confidence,
            allocation,
            stopLoss: -5,
            takeProfit: confidence === 'HIGH' ? 15 : 10,
            legs: {
                conservative: { signal: finalSignal, strength: finalStrength },
                aggressive: { signal: 'HOLD', strength: 0 },
                technical: { signal: 'HOLD', strength: 0 }
            },
            indicators: { 
                rsi: 50, 
                volumeRatio: Math.round(volumeRatio * 10) / 10, 
                pricePosition: 50, 
                trend: priceData.change24h > 5 ? 'BULLISH' : priceData.change24h < -5 ? 'BEARISH' : 'NEUTRAL' 
            },
            inputs: { indexValue: Math.round(indexValue * 10) / 10, level: index.level, whaleSignal, gasCongestion: 'LOW', alphaScore },
            price: priceData.price,
            high24h: priceData.high24h,
            low24h: priceData.low24h,
            change24h: priceData.change24h,
            reasoning: [
                `Index ${Math.round(indexValue)} (${index.level})`,
                `Whales: ${whaleSignal}`,
                priceData.change24h ? `24h: ${priceData.change24h > 0 ? '+' : ''}${priceData.change24h.toFixed(1)}%` : ''
            ].filter(Boolean),
            timestamp: new Date().toISOString()
        };
    } catch (err) {
        console.error(`Signal error ${symbol}:`, err.message);
        return null;
    }
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol')?.toUpperCase();
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    try {
        const supportedCoins = Object.keys(COIN_PAIRS);
        
        if (symbol && supportedCoins.includes(symbol)) {
            const signal = await generateCoinSignal(symbol, baseUrl);
            return Response.json(signal || { error: 'Failed' }, { status: signal ? 200 : 500 });
        }

        const allSignals = await Promise.all(
            supportedCoins.map(coin => generateCoinSignal(coin, baseUrl))
        );

        const signals = allSignals.filter(Boolean);
        const strongSignals = signals.filter(s => s.strength >= 55 && s.signal !== 'HOLD');

        return Response.json({
            signals,
            strongSignals: strongSignals.length,
            topSignal: strongSignals.length > 0 
                ? strongSignals.sort((a, b) => b.strength - a.strength)[0]
                : null,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
