import { getBitcoinDominance } from '@/lib/macro-analyzer';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // 1 hour cache — well within CoinGecko free limits

export async function GET() {
    try {
        const response = await fetch(
            'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&sparkline=false&price_change_percentage=24h',
            { next: { revalidate: 3600 }, signal: AbortSignal.timeout(12000) }
        );
        if (!response.ok) throw new Error(`CoinGecko ${response.status}`);
        const coins = await response.json();
        if (!Array.isArray(coins)) throw new Error('Invalid response');

        const gainers = [...coins].filter(c => c.price_change_percentage_24h > 0)
            .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h).slice(0, 3);
        const losers = [...coins].filter(c => c.price_change_percentage_24h < 0)
            .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h).slice(0, 3);

        const totalPositive = coins.filter(c => c.price_change_percentage_24h > 0).length;
        const totalNegative = coins.filter(c => c.price_change_percentage_24h < 0).length;
        const avgChange = coins.reduce((sum, c) => sum + (c.price_change_percentage_24h || 0), 0) / coins.length;
        const positiveRatio = totalPositive / coins.length;

        let marketMood, moodEmoji, moodDescription;
        if (positiveRatio > 0.8)      { marketMood = 'Bullish';            moodEmoji = '🚀'; moodDescription = 'Market is strongly green. Most coins pumping. Watch for FOMO tops.'; }
        else if (positiveRatio > 0.6) { marketMood = 'Cautiously Bullish'; moodEmoji = '📈'; moodDescription = 'Healthy green day. Good momentum without extreme euphoria.'; }
        else if (positiveRatio > 0.4) { marketMood = 'Neutral';            moodEmoji = '⚖️'; moodDescription = 'Mixed signals. Market digesting recent moves. Wait for clarity.'; }
        else if (positiveRatio > 0.2) { marketMood = 'Cautiously Bearish'; moodEmoji = '📉'; moodDescription = 'Red dominates. Selling pressure building. Be careful with new positions.'; }
        else                          { marketMood = 'Bearish';             moodEmoji = '💀'; moodDescription = 'Heavy selling across the board. Fear is high.'; }

        const brief = generateBrief({ avgChange, positiveRatio, gainers: gainers.map(c => ({ symbol: c.symbol.toUpperCase(), change24h: c.price_change_percentage_24h })), losers: losers.map(c => ({ symbol: c.symbol.toUpperCase(), change24h: c.price_change_percentage_24h })), marketMood });

        // Get BTC dominance from shared macro cache (same CoinGecko call, cached)
        const btcDomData = await getBitcoinDominance().catch(() => ({ percentage: null }));

        return Response.json({
            mood: { label: marketMood, emoji: moodEmoji, description: moodDescription },
            stats: {
                totalCoins: coins.length,
                green: totalPositive,
                red: totalNegative,
                avgChange24h: Math.round(avgChange * 100) / 100,
                btcDom: btcDomData?.percentage ?? null
            },
            topGainers: gainers.map(c => ({ id: c.id, symbol: c.symbol.toUpperCase(), name: c.name, image: c.image, change24h: c.price_change_percentage_24h, price: c.current_price })),
            topLosers: losers.map(c => ({ id: c.id, symbol: c.symbol.toUpperCase(), name: c.name, image: c.image, change24h: c.price_change_percentage_24h, price: c.current_price })),
            brief,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Market brief error:', error);
        return Response.json({ error: 'Failed' }, { status: 500 });
    }
}

function generateBrief({ avgChange, positiveRatio, gainers, losers, marketMood }) {
    const lines = [];
    if (marketMood === 'Bullish') lines.push(`Strong bull session today. ${Math.round(positiveRatio * 100)}% of top coins are green with an average gain of +${avgChange.toFixed(2)}%.`);
    else if (marketMood === 'Cautiously Bullish') lines.push(`Solid green day across crypto. Healthy buying pressure with ${avgChange > 0 ? '+' : ''}${avgChange.toFixed(2)}% average movement.`);
    else if (marketMood === 'Neutral') lines.push(`Mixed market today. Equal buying and selling pressure with average change at ${avgChange > 0 ? '+' : ''}${avgChange.toFixed(2)}%.`);
    else if (marketMood === 'Cautiously Bearish') lines.push(`Red-dominated session. Selling pressure visible with average losses around ${avgChange.toFixed(2)}%.`);
    else lines.push(`Heavy selloff across the board. Average loss of ${avgChange.toFixed(2)}% signals broad market weakness.`);
    if (gainers.length > 0) lines.push(`Top gainer: ${gainers[0].symbol} +${gainers[0].change24h.toFixed(2)}%.${gainers[1] ? ` ${gainers[1].symbol} also catching bids.` : ''}`);
    if (losers.length > 0) lines.push(`Weakest: ${losers[0].symbol} ${losers[0].change24h.toFixed(2)}%. Watch support levels.`);
    if (marketMood === 'Bullish' || marketMood === 'Cautiously Bullish') lines.push("Momentum is strong but don't ignore risk management.");
    else if (marketMood === 'Neutral') lines.push('Consolidation phases often precede big moves. Set alerts and wait for breakouts.');
    else lines.push('Bear phases create the best long-term entry points. DCA into strength, not panic.');
    return lines.join(' ');
}
