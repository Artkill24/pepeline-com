export const dynamic = 'force-dynamic';
export const revalidate = 1800;

// Real sentiment using price data (no Math.random)
function calcSentiment(change24h, high24h, low24h, price) {
    // 1. Momentum: price change direction
    const momentum = 50 + Math.min(Math.max(change24h * 3, -35), 35);

    // 2. Real volatility: range % (high-low)/low
    const volatilityPct = high24h && low24h
        ? ((high24h - low24h) / low24h) * 100
        : Math.abs(change24h);

    // High volatility + positive = greed, high volatility + negative = fear
    const volatilityScore = change24h >= 0
        ? Math.min(volatilityPct * 3, 20)
        : -Math.min(volatilityPct * 3, 20);

    // 3. Position in range: where is price vs today's high/low
    let rangeScore = 0;
    if (high24h && low24h && high24h !== low24h) {
        const rangePosition = (price - low24h) / (high24h - low24h); // 0=at low, 1=at high
        rangeScore = (rangePosition - 0.5) * 20; // -10 to +10
    }

    // Combine
    let score = (momentum * 0.5) + (50 + volatilityScore) * 0.3 + (50 + rangeScore) * 0.2;
    score = Math.max(0, Math.min(100, score));

    let level, emoji;
    if (score < 20)      { level = 'Calm';       emoji = '🟢'; }
    else if (score < 40) { level = 'Neutral';    emoji = '🔵'; }
    else if (score < 60) { level = 'Active';     emoji = '🟡'; }
    else if (score < 80) { level = 'Hyped';      emoji = '🟠'; }
    else                 { level = 'Peak Degen'; emoji = '🔴'; }

    return { score: Math.round(score * 100) / 100, level, emoji };
}

// Supra → unified format
function mapSupraCoin(supraCoin) {
    const { score, level, emoji } = calcSentiment(
        supraCoin.change24h,
        supraCoin.high24h,
        supraCoin.low24h,
        supraCoin.price
    );
    return {
        id: supraCoin.symbol.toLowerCase(),
        symbol: supraCoin.symbol,
        name: supraCoin.symbol,
        image: `https://assets.coingecko.com/coins/images/1/${supraCoin.symbol.toLowerCase()}.png`,
        price: supraCoin.price,
        high24h: supraCoin.high24h,
        low24h: supraCoin.low24h,
        change24h: supraCoin.change24h,
        sentiment: score,
        level,
        emoji,
        source: 'supra'
    };
}

export async function GET() {
    try {
        // Try CoinGecko first
        const response = await fetch(
            'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h',
            { next: { revalidate: 1800 }, signal: AbortSignal.timeout(12000) }
        );

        if (!response.ok) throw new Error(`CoinGecko ${response.status}`);

        const coins = await response.json();
        const coinsWithSentiment = coins.map(coin => {
            const { score, level, emoji } = calcSentiment(
                coin.price_change_percentage_24h || 0,
                coin.high_24h,
                coin.low_24h,
                coin.current_price
            );
            return {
                id: coin.id,
                symbol: coin.symbol.toUpperCase(),
                name: coin.name,
                image: coin.image,
                price: coin.current_price,
                high24h: coin.high_24h,
                low24h: coin.low_24h,
                change24h: coin.price_change_percentage_24h,
                sentiment: score,
                level,
                emoji,
                source: 'coingecko'
            };
        });

        return Response.json({
            coins: coinsWithSentiment,
            timestamp: new Date().toISOString(),
            source: 'coingecko'
        });

    } catch (error) {
        console.error('CoinGecko error, falling back to Supra:', error.message);

        try {
            const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
            const supraRes = await fetch(`${baseUrl}/api/supra-prices`, {
                signal: AbortSignal.timeout(8000)
            });

            if (!supraRes.ok) throw new Error(`Supra ${supraRes.status}`);

            const supraData = await supraRes.json();
            const coinsWithSentiment = supraData.prices.map(mapSupraCoin);

            return Response.json({
                coins: coinsWithSentiment,
                timestamp: new Date().toISOString(),
                source: 'supra',
                fallback: true
            });

        } catch (supraError) {
            console.error('Supra fallback failed:', supraError.message);
            return Response.json({
                error: 'Both CoinGecko and Supra failed'
            }, { status: 500 });
        }
    }
}
