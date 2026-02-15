export const dynamic = 'force-dynamic';
export const revalidate = 1800; // 30 min

export async function GET() {
    try {
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
                emoji
            };
        });

        return Response.json({ coins: coinsWithSentiment, timestamp: new Date().toISOString() });
    } catch (error) {
        console.error('Top coins error:', error);
        return Response.json({ error: 'Failed' }, { status: 500 });
    }
}
