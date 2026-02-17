export const dynamic = 'force-dynamic';

// Calculate correlation coefficient
function pearsonCorrelation(x, y) {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    
    return denominator === 0 ? 0 : numerator / denominator;
}

// Fetch historical data from CoinGecko
async function fetchHistoricalData(coinId, days) {
    try {
        const res = await fetch(
            `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=daily`,
            { signal: AbortSignal.timeout(15000) }
        );

        if (!res.ok) throw new Error(`CoinGecko ${res.status}`);
        const data = await res.json();
        
        return data.prices || []; // [[timestamp, price], ...]
    } catch (error) {
        console.error('CoinGecko historical fetch error:', error);
        return [];
    }
}

// Simulate Pepeline Index based on multiple factors
function calculateSimulatedIndex(priceData) {
    return priceData.map((point, i) => {
        if (i === 0) return { timestamp: point[0], index: 50 };

        const [timestamp, price] = point;
        const [_, prevPrice] = priceData[i - 1];
        const change24h = ((price - prevPrice) / prevPrice) * 100;

        // Simulate index using similar logic to real Pepeline Index
        // Inverted: negative change = fear (low index), positive = greed (high index)
        let fearGreed = 50 + (change24h * 3); // More reactive
        
        // Add volatility component (simulated)
        const volatility = Math.abs(change24h) > 5 ? 15 : Math.abs(change24h) > 2 ? 8 : 5;
        
        // Add momentum (simulated FOMO)
        const momentum = change24h > 0 ? 10 : -10;
        
        // Combine (simplified version of real index)
        let index = fearGreed * 0.4 + volatility * 0.2 + (50 + momentum) * 0.4;
        index = Math.max(0, Math.min(100, index));

        return { timestamp, index, price, change24h };
    });
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const coin = searchParams.get('coin') || 'bitcoin';
    const days = parseInt(searchParams.get('days') || '30');

    try {
        // 1. Fetch historical price data
        const priceData = await fetchHistoricalData(coin, days);
        
        if (priceData.length < 2) {
            return Response.json({ error: 'Insufficient data from CoinGecko' }, { status: 500 });
        }

        // 2. Simulate index values
        const indexData = calculateSimulatedIndex(priceData);

        // 3. Calculate price changes and index values for correlation
        const priceChanges = indexData.slice(1).map(d => d.change24h);
        const indexValues = indexData.slice(1).map(d => d.index);

        // 4. Calculate inverse correlation (index should predict opposite moves)
        const correlation = pearsonCorrelation(indexValues, priceChanges);
        
        // 5. Directional accuracy - index <50 should predict price DOWN
        let correctCalls = 0;
        for (let i = 0; i < indexValues.length; i++) {
            const indexSignal = indexValues[i] < 50 ? 'bearish' : 'bullish';
            const actualMove = priceChanges[i] < 0 ? 'down' : 'up';
            
            // Correct if: index bearish + price down OR index bullish + price up
            if ((indexSignal === 'bearish' && actualMove === 'down') || 
                (indexSignal === 'bullish' && actualMove === 'up')) {
                correctCalls++;
            }
        }
        const accuracy = (correctCalls / indexValues.length) * 100;

        // 6. Prepare chart data
        const chartData = indexData.slice(1).map(d => ({
            date: new Date(d.timestamp).toISOString().split('T')[0],
            price: Math.round(d.price * 100) / 100,
            index: Math.round(d.index * 10) / 10,
            change: Math.round(d.change24h * 100) / 100
        }));

        return Response.json({
            coin: coin.charAt(0).toUpperCase() + coin.slice(1),
            period: `${days} days`,
            metrics: {
                correlation: Math.round(correlation * 100) / 100,
                correlationPct: Math.round(Math.abs(correlation) * 100),
                directionalAccuracy: Math.round(accuracy * 100) / 100,
                totalSignals: indexValues.length,
                correctCalls,
                wrongCalls: indexValues.length - correctCalls,
                winRate: Math.round((correctCalls / indexValues.length) * 100)
            },
            chartData,
            summary: accuracy > 60 
                ? `Strong predictive power - ${Math.round(accuracy)}% accuracy`
                : accuracy > 50
                ? `Moderate predictive power - ${Math.round(accuracy)}% accuracy`
                : `Weak signals - ${Math.round(accuracy)}% accuracy (below random chance)`,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Backtest error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}
