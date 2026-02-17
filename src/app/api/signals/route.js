export const dynamic = 'force-dynamic';

// Hybrid Strategy: Pepeline Index + Whale Signals + Supra Prices
async function generateSignal() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pepeline.com';

    // Fetch all data in parallel
    const [indexRes, metricsRes, pricesRes] = await Promise.allSettled([
        fetch(`${baseUrl}/api/index`, { cache: 'no-store' }),
        fetch(`${baseUrl}/api/advanced-metrics`, { cache: 'no-store' }),
        fetch(`${baseUrl}/api/supra-prices?pair=sol_usdt`, { cache: 'no-store' }),
    ]);

    const index    = indexRes.status    === 'fulfilled' ? await indexRes.value.json()    : null;
    const metrics  = metricsRes.status  === 'fulfilled' ? await metricsRes.value.json()  : null;
    const solPrice = pricesRes.status   === 'fulfilled' ? await pricesRes.value.json()   : null;

    if (!index || !metrics) return null;

    const indexValue   = index.index || 50;
    const whaleSignal  = metrics?.onchain?.whales?.signal || 'NEUTRAL';
    const gasCongestion = metrics?.onchain?.gas?.congestion || 'MEDIUM';
    const alphaScore   = metrics?.alphaScore || 50;

    // ─── CONSERVATIVE LEG (Index-based) ───────────────────────────────────────
    // BUY SOL when fear + whale accumulation
    // SELL SOL (hold USDC) when greed + whale distribution
    let conservativeSignal = 'HOLD';
    let conservativeStrength = 0;

    if (indexValue <= 25 && whaleSignal === 'ACCUMULATION') {
        conservativeSignal = 'BUY';
        conservativeStrength = Math.round((25 - indexValue) * 2 + 20); // 20-70
    } else if (indexValue >= 75 && whaleSignal === 'DISTRIBUTION') {
        conservativeSignal = 'SELL';
        conservativeStrength = Math.round((indexValue - 75) * 2 + 20);
    } else if (indexValue <= 30) {
        conservativeSignal = 'BUY';
        conservativeStrength = Math.round((30 - indexValue) * 1.5);
    } else if (indexValue >= 70) {
        conservativeSignal = 'SELL';
        conservativeStrength = Math.round((indexValue - 70) * 1.5);
    }

    // ─── AGGRESSIVE LEG (Whale + Alpha) ───────────────────────────────────────
    let aggressiveSignal = 'HOLD';
    let aggressiveStrength = 0;

    if (whaleSignal === 'ACCUMULATION' && alphaScore >= 65) {
        aggressiveSignal = 'BUY';
        aggressiveStrength = Math.round((alphaScore - 50) * 1.5);
    } else if (whaleSignal === 'DISTRIBUTION' && alphaScore <= 35) {
        aggressiveSignal = 'SELL';
        aggressiveStrength = Math.round((50 - alphaScore) * 1.5);
    }

    // ─── HYBRID COMBINE ───────────────────────────────────────────────────────
    let finalSignal = 'HOLD';
    let finalStrength = 0;
    let confidence = 'LOW';

    // Both legs agree → stronger signal
    if (conservativeSignal === aggressiveSignal && conservativeSignal !== 'HOLD') {
        finalSignal = conservativeSignal;
        finalStrength = Math.min(100, Math.round((conservativeStrength + aggressiveStrength) * 0.8));
        confidence = finalStrength >= 60 ? 'HIGH' : 'MEDIUM';
    } else if (conservativeSignal !== 'HOLD') {
        // Only conservative fires
        finalSignal = conservativeSignal;
        finalStrength = conservativeStrength;
        confidence = 'LOW';
    } else if (aggressiveSignal !== 'HOLD') {
        // Only aggressive fires
        finalSignal = aggressiveSignal;
        finalStrength = aggressiveStrength;
        confidence = 'LOW';
    }

    // Gas penalty — don't BUY when gas is very high
    if (gasCongestion === 'HIGH' && finalSignal === 'BUY') {
        finalStrength = Math.max(0, finalStrength - 20);
        if (finalStrength < 10) finalSignal = 'HOLD';
    }

    // Build reasoning
    const reasons = [];
    if (indexValue <= 30) reasons.push(`📉 Index at ${indexValue} (${index.level}) — fear = opportunity`);
    if (indexValue >= 70) reasons.push(`📈 Index at ${indexValue} (${index.level}) — greed = caution`);
    if (whaleSignal === 'ACCUMULATION') reasons.push(`🐋 Whales accumulating — bullish signal`);
    if (whaleSignal === 'DISTRIBUTION') reasons.push(`🐋 Whales distributing — bearish signal`);
    if (alphaScore >= 65) reasons.push(`🎯 Alpha score ${alphaScore} — strong momentum`);
    if (alphaScore <= 35) reasons.push(`🎯 Alpha score ${alphaScore} — weak momentum`);
    if (gasCongestion === 'HIGH') reasons.push(`⛽ High gas — reduced buy confidence`);
    if (gasCongestion === 'LOW') reasons.push(`⛽ Low gas — good time to transact`);

    // Suggested allocation (% of portfolio to swap)
    const allocation = confidence === 'HIGH' ? 50 :
                       confidence === 'MEDIUM' ? 30 : 15;

    return {
        signal: finalSignal,
        strength: finalStrength,
        confidence,
        allocation, // % suggested
        pair: 'SOL/USDC',
        legs: {
            conservative: { signal: conservativeSignal, strength: conservativeStrength },
            aggressive: { signal: aggressiveSignal, strength: aggressiveStrength }
        },
        inputs: {
            index: indexValue,
            level: index.level,
            whaleSignal,
            gasCongestion,
            alphaScore
        },
        price: solPrice?.price || null,
        change24h: solPrice?.change24h || null,
        reasoning: reasons,
        timestamp: new Date().toISOString()
    };
}

export async function GET() {
    try {
        const signal = await generateSignal();
        if (!signal) {
            return Response.json({ error: 'Could not generate signal' }, { status: 500 });
        }
        return Response.json(signal);
    } catch (error) {
        console.error('Signal error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}
