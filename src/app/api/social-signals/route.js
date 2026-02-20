export const dynamic = 'force-dynamic';

// Simulate social dominance (in production, use Twitter API or social scraping)
function analyzeSocialDominance() {
    // Placeholder: In reality, scrape Twitter trending or use LunarCrush API
    const trends = [
        { term: 'Bitcoin', mentions: 45000, sentiment: 0.6 },
        { term: 'Ethereum', mentions: 32000, sentiment: 0.55 },
        { term: 'Pepe', mentions: 28000, sentiment: 0.75 },
        { term: 'Solana', mentions: 22000, sentiment: 0.7 },
        { term: 'AI tokens', mentions: 18000, sentiment: 0.8 }
    ];

    const totalMentions = trends.reduce((sum, t) => sum + t.mentions, 0);
    const btcDominance = (trends[0].mentions / totalMentions) * 100;
    
    // If BTC dominance < 30%, we're in alt season
    const phase = btcDominance < 30 ? 'ALT_SEASON' : 
                  btcDominance > 50 ? 'BTC_DOMINANCE' : 'MIXED';

    return {
        phase,
        btcDominance: Math.round(btcDominance * 10) / 10,
        trending: trends.slice(0, 5),
        signal: phase === 'ALT_SEASON' ? 'ALTS_BULLISH' : 
                phase === 'BTC_DOMINANCE' ? 'BTC_FOCUS' : 'NEUTRAL'
    };
}

export async function GET() {
    try {
        const socialData = analyzeSocialDominance();
        
        return Response.json({
            ...socialData,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
