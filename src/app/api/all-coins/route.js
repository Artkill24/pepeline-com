export const dynamic = 'force-dynamic';
export const revalidate = 1800; // 30 min

// Supra → CoinGecko format
function mapSupraCoin(supraCoin) {
    const change = supraCoin.change24h || 0;
    let score = 50 + Math.min(Math.max(change * 2, -30), 30) + (Math.random() - 0.5) * 10;
    score = Math.max(0, Math.min(100, score));

    let level, emoji;
    if (score < 20)      { level = 'Calm';       emoji = '🟢'; }
    else if (score < 40) { level = 'Neutral';    emoji = '🔵'; }
    else if (score < 60) { level = 'Active';     emoji = '🟡'; }
    else if (score < 80) { level = 'Hyped';      emoji = '🟠'; }
    else                 { level = 'Peak Degen'; emoji = '🔴'; }

    return {
        id: supraCoin.symbol.toLowerCase(),
        symbol: supraCoin.symbol,
        name: supraCoin.symbol,
        image: `https://assets.coingecko.com/coins/images/1/${supraCoin.symbol.toLowerCase()}.png`,
        price: supraCoin.price,
        change24h: supraCoin.change24h,
        sentiment: Math.round(score * 100) / 100,
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
            const change = coin.price_change_percentage_24h || 0;
            let score = 50 + Math.min(Math.max(change * 2, -30), 30) + (Math.random() - 0.5) * 10;
            score = Math.max(0, Math.min(100, score));

            let level, emoji;
            if (score < 20)      { level = 'Calm';       emoji = '🟢'; }
            else if (score < 40) { level = 'Neutral';    emoji = '🔵'; }
            else if (score < 60) { level = 'Active';     emoji = '🟡'; }
            else if (score < 80) { level = 'Hyped';      emoji = '🟠'; }
            else                 { level = 'Peak Degen'; emoji = '🔴'; }

            return {
                id: coin.id,
                symbol: coin.symbol.toUpperCase(),
                name: coin.name,
                image: coin.image,
                price: coin.current_price,
                change24h: coin.price_change_percentage_24h,
                sentiment: Math.round(score * 100) / 100,
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

        // Fallback to Supra
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
            console.error('Supra fallback also failed:', supraError.message);
            return Response.json({
                error: 'Both CoinGecko and Supra failed',
                details: {
                    coingecko: error.message,
                    supra: supraError.message
                }
            }, { status: 500 });
        }
    }
}
