export const dynamic = 'force-dynamic';

function calculateRSI(prices, period = 14) {
    if (!prices || prices.length < period + 1) return 50;
    const changes = [];
    for (let i = 1; i < prices.length; i++) changes.push(prices[i] - prices[i - 1]);
    
    let gains = 0, losses = 0;
    for (let i = 0; i < period; i++) {
        if (changes[i] > 0) gains += changes[i];
        else losses += Math.abs(changes[i]);
    }
    
    const avgGain = gains / period;
    const avgLoss = losses / period;
    if (avgLoss === 0) return 100;
    const rs = avgGain / avgLoss;
    return Math.round((100 - (100 / (1 + rs))) * 10) / 10;
}

async function generateCoinSignal(symbol, baseUrl) {
    const pair = { BTC: 'btc_usdt', ETH: 'eth_usdt', SOL: 'sol_usdt' }[symbol];
    
    try {
        const [indexRes, metricsRes, priceRes] = await Promise.all([
            fetch(`${baseUrl}/api/index`, { cache: 'no-store' }),
            fetch(`${baseUrl}/api/advanced-metrics`, { cache: 'no-store' }),
            fetch(`${baseUrl}/api/supra-prices?pair=${pair}`, { cache: 'no-store' })
        ]);

        const index = await indexRes.json();
        const metrics = await metricsRes.json();
        const priceData = await priceRes.json();

        if (!index || !metrics || !priceData) return null;

        const indexValue = index.index || 50;
        const whaleSignal = metrics?.onchain?.whales?.signal || 'NEUTRAL';
        const alphaScore = metrics?.alphaScore || 50;
        const rsi = 50; // Simplified
        const volumeRatio = Math.abs(priceData.change24h || 0) * 2;

        let finalSignal = 'HOLD', finalStrength = 0, confidence = 'LOW';

        // Simple logic
        if (indexValue <= 25 && whaleSignal === 'ACCUMULATION') {
            finalSignal = 'BUY';
            finalStrength = Math.round((25 - indexValue) * 3);
            confidence = 'MEDIUM';
        } else if (indexValue >= 75 && whaleSignal === 'DISTRIBUTION') {
            finalSignal = 'SELL';
            finalStrength = Math.round((indexValue - 75) * 3);
            confidence = 'MEDIUM';
        }

        const allocation = confidence === 'HIGH' ? 60 : confidence === 'MEDIUM' ? 40 : 20;

        return {
            symbol,
            signal: finalSignal,
            strength: finalStrength,
            confidence,
            allocation,
            stopLoss: -4,
            takeProfit: 10,
            legs: {
                conservative: { signal: finalSignal, strength: finalStrength },
                aggressive: { signal: 'HOLD', strength: 0 },
                technical: { signal: 'HOLD', strength: 0 }
            },
            indicators: { rsi, volumeRatio: Math.round(volumeRatio * 10) / 10, pricePosition: 50, trend: 'NEUTRAL' },
            inputs: { indexValue, level: index.level, whaleSignal, gasCongestion: 'LOW', alphaScore },
            price: priceData.price,
            high24h: priceData.high24h,
            low24h: priceData.low24h,
            change24h: priceData.change24h,
            reasoning: [`Index ${indexValue} (${index.level})`, `Whales: ${whaleSignal}`],
            timestamp: new Date().toISOString()
        };
    } catch (err) {
        console.error(`Error ${symbol}:`, err);
        return null;
    }
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol')?.toUpperCase();
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    try {
        if (symbol && ['BTC', 'ETH', 'SOL'].includes(symbol)) {
            const signal = await generateCoinSignal(symbol, baseUrl);
            return Response.json(signal || { error: 'Failed' }, { status: signal ? 200 : 500 });
        }

        const [btc, eth, sol] = await Promise.all([
            generateCoinSignal('BTC', baseUrl),
            generateCoinSignal('ETH', baseUrl),
            generateCoinSignal('SOL', baseUrl)
        ]);

        const signals = [btc, eth, sol].filter(Boolean);
        const strongSignals = signals.filter(s => s.strength >= 60 && s.signal !== 'HOLD');

        return Response.json({
            signals,
            strongSignals: strongSignals.length,
            topSignal: strongSignals[0] || null,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
