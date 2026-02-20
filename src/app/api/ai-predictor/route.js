export const dynamic = 'force-dynamic';

function generatePrediction(data) {
    let anomaly = false;
    let type = 'normal';
    let severity = 'low';
    let signal = 'HOLD';
    let confidence = 60;
    let reasoning = 'Market conditions appear normal.';

    // Bull Trap
    if (data.btcChange > 5 && data.whaleSignal === 'DISTRIBUTION' && data.index > 70) {
        anomaly = true;
        type = 'bull_trap';
        severity = 'high';
        signal = 'SELL';
        confidence = 75;
        reasoning = 'Price rising but whales distributing + high greed = potential bull trap.';
    }
    // Accumulation
    else if (data.btcChange < -5 && data.whaleSignal === 'ACCUMULATION' && data.index < 30) {
        anomaly = true;
        type = 'accumulation';
        severity = 'medium';
        signal = 'BUY';
        confidence = 70;
        reasoning = 'Price dropping but whales accumulating + fear = opportunity.';
    }
    // Distribution Top
    else if (data.index > 80 && data.gas > 100 && data.whaleSignal === 'DISTRIBUTION') {
        anomaly = true;
        type = 'distribution_top';
        severity = 'critical';
        signal = 'SELL';
        confidence = 85;
        reasoning = 'Extreme greed + high gas + distribution = market top.';
    }

    return { anomaly, type, severity, signal, confidence, reasoning };
}

export async function GET() {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
        
        const [index, metrics, prices] = await Promise.all([
            fetch(`${baseUrl}/api/index`).then(r => r.json()),
            fetch(`${baseUrl}/api/advanced-metrics`).then(r => r.json()),
            fetch(`${baseUrl}/api/all-prices`).then(r => r.json())
        ]);

        const btc = prices.prices?.find(p => p.symbol === 'BTC');

        const marketData = {
            index: index.index || 50,
            level: index.level || 'NEUTRAL',
            btcPrice: btc?.price || 0,
            btcChange: btc?.change24h || 0,
            whaleSignal: metrics.onchain?.whales?.signal || 'NEUTRAL',
            gas: metrics.onchain?.gas?.safe || 0
        };

        const prediction = generatePrediction(marketData);

        return Response.json({
            prediction,
            marketData,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
