export const dynamic = 'force-dynamic';
export const revalidate = 21600; // 6 hours

export async function GET() {
    try {
        // Fetch top 20 coins per stats
        const response = await fetch(
            'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&sparkline=false&price_change_percentage=24h,7d',
            { next: { revalidate: 21600 } }
        );
        if (!response.ok) throw new Error('Failed');
        const coins = await response.json();

        // Calcola stats globali
        const gainers = coins
            .filter(c => c.price_change_percentage_24h > 0)
            .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
            .slice(0, 3);

        const losers = coins
            .filter(c => c.price_change_percentage_24h < 0)
            .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
            .slice(0, 3);

        const totalPositive = coins.filter(c => c.price_change_percentage_24h > 0).length;
        const totalNegative = coins.filter(c => c.price_change_percentage_24h < 0).length;
        const avgChange = coins.reduce((sum, c) => sum + (c.price_change_percentage_24h || 0), 0) / coins.length;

        // Determina mood del mercato
        let marketMood, moodEmoji, moodDescription;
        const positiveRatio = totalPositive / coins.length;

        if (positiveRatio > 0.8) {
            marketMood = 'Bullish';
            moodEmoji = '🚀';
            moodDescription = 'Market is strongly green. Most coins pumping. Watch for FOMO tops.';
        } else if (positiveRatio > 0.6) {
            marketMood = 'Cautiously Bullish';
            moodEmoji = '📈';
            moodDescription = 'Healthy green day. Good momentum without extreme euphoria.';
        } else if (positiveRatio > 0.4) {
            marketMood = 'Neutral';
            moodEmoji = '⚖️';
            moodDescription = 'Mixed signals. Market digesting recent moves. Wait for clarity.';
        } else if (positiveRatio > 0.2) {
            marketMood = 'Cautiously Bearish';
            moodEmoji = '📉';
            moodDescription = 'Red dominates. Selling pressure building. Be careful with new positions.';
        } else {
            marketMood = 'Bearish';
            moodEmoji = '💀';
            moodDescription = 'Heavy selling across the board. Fear is high. Could be opportunity or more pain.';
        }

        // AI Brief generato algoritmicamente
        const brief = generateAIBrief({ avgChange, positiveRatio, gainers, losers, marketMood });

        return Response.json({
            mood: { label: marketMood, emoji: moodEmoji, description: moodDescription },
            stats: {
                totalCoins: coins.length,
                green: totalPositive,
                red: totalNegative,
                avgChange24h: Math.round(avgChange * 100) / 100,
                dominance: {
                    btc: coins.find(c => c.id === 'bitcoin')?.market_cap || 0,
                    total: coins.reduce((sum, c) => sum + (c.market_cap || 0), 0)
                }
            },
            topGainers: gainers.map(c => ({
                id: c.id,
                symbol: c.symbol.toUpperCase(),
                name: c.name,
                image: c.image,
                change24h: c.price_change_percentage_24h,
                price: c.current_price
            })),
            topLosers: losers.map(c => ({
                id: c.id,
                symbol: c.symbol.toUpperCase(),
                name: c.name,
                image: c.image,
                change24h: c.price_change_percentage_24h,
                price: c.current_price
            })),
            brief,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Market brief error:', error);
        return Response.json({ error: 'Failed' }, { status: 500 });
    }
}

function generateAIBrief({ avgChange, positiveRatio, gainers, losers, marketMood }) {
    const lines = [];

    // Opening
    if (marketMood === 'Bullish') {
        lines.push(`Strong bull session today. ${Math.round(positiveRatio * 100)}% of top coins are green with an average gain of +${avgChange.toFixed(2)}%.`);
    } else if (marketMood === 'Cautiously Bullish') {
        lines.push(`Solid green day across crypto. The market is showing healthy buying pressure with ${avgChange > 0 ? '+' : ''}${avgChange.toFixed(2)}% average movement.`);
    } else if (marketMood === 'Neutral') {
        lines.push(`Mixed market today. Roughly equal buying and selling pressure with average change at ${avgChange > 0 ? '+' : ''}${avgChange.toFixed(2)}%.`);
    } else if (marketMood === 'Cautiously Bearish') {
        lines.push(`Red-dominated session. Selling pressure is visible with average losses around ${avgChange.toFixed(2)}%. Dip buyers watching closely.`);
    } else {
        lines.push(`Heavy selloff across the board. Average loss of ${avgChange.toFixed(2)}% signals broad market weakness. Capitulation or just a correction?`);
    }

    // Gainers mention
    if (gainers.length > 0) {
        const topGainer = gainers[0];
        lines.push(`Top gainer: ${topGainer.symbol.toUpperCase()} surging +${topGainer.price_change_percentage_24h.toFixed(2)}%. ${gainers.length > 1 ? `${gainers[1].symbol.toUpperCase()} and ${gainers[2]?.symbol.toUpperCase() || ''} also catching bids.` : ''}`);
    }

    // Losers mention
    if (losers.length > 0) {
        const topLoser = losers[0];
        lines.push(`Weakest: ${topLoser.symbol.toUpperCase()} bleeding ${topLoser.price_change_percentage_24h.toFixed(2)}%. ${losers.length > 1 ? `${losers[1].symbol.toUpperCase()} also under pressure.` : ''} Watch support levels.`);
    }

    // Closing advice
    if (marketMood === 'Bullish' || marketMood === 'Cautiously Bullish') {
        lines.push('Momentum is strong but don\'t ignore risk management. Trailing stops are your friend in strong markets.');
    } else if (marketMood === 'Neutral') {
        lines.push('Consolidation phases often precede big moves. Set alerts and wait for breakouts rather than chasing.');
    } else {
        lines.push('Bear phases create the best long-term entry points. DCA into strength, not panic.');
    }

    return lines.join(' ');
}
