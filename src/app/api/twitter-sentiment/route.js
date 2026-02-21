export const dynamic = 'force-dynamic';

const TWITTER_BEARER = process.env.TWITTER_BEARER_TOKEN;

async function searchTweets(query, maxResults = 10) {
    if (!TWITTER_BEARER) {
        // Fallback to simulated data
        return {
            btc: Math.floor(Math.random() * 50000) + 30000,
            eth: Math.floor(Math.random() * 30000) + 20000,
            pepe: Math.floor(Math.random() * 20000) + 15000,
            solana: Math.floor(Math.random() * 15000) + 10000,
            sentiment: (Math.random() * 0.4 + 0.5).toFixed(2)
        };
    }

    try {
        const url = `https://api.twitter.com/2/tweets/search/recent?query=${encodeURIComponent(query)}&max_results=${maxResults}&tweet.fields=public_metrics`;
        
        const res = await fetch(url, {
            headers: { 'Authorization': `Bearer ${TWITTER_BEARER}` },
            signal: AbortSignal.timeout(10000)
        });

        if (!res.ok) throw new Error('Twitter API failed');
        
        const data = await res.json();
        return data;
    } catch (err) {
        console.error('Twitter error:', err);
        return null;
    }
}

export async function GET() {
    try {
        // Simulate real Twitter trending data
        const trending = {
            coins: [
                { term: 'Bitcoin', mentions: Math.floor(Math.random() * 20000) + 40000, sentiment: 0.6 },
                { term: 'Ethereum', mentions: Math.floor(Math.random() * 15000) + 30000, sentiment: 0.55 },
                { term: 'Pepe', mentions: Math.floor(Math.random() * 15000) + 25000, sentiment: 0.75 },
                { term: 'Solana', mentions: Math.floor(Math.random() * 10000) + 20000, sentiment: 0.7 },
                { term: 'AI tokens', mentions: Math.floor(Math.random() * 8000) + 15000, sentiment: 0.8 }
            ],
            totalMentions: 0,
            dominance: {},
            timestamp: new Date().toISOString()
        };

        trending.totalMentions = trending.coins.reduce((sum, c) => sum + c.mentions, 0);
        
        trending.coins.forEach(coin => {
            trending.dominance[coin.term] = ((coin.mentions / trending.totalMentions) * 100).toFixed(1);
        });

        const btcDom = parseFloat(trending.dominance.Bitcoin);
        const phase = btcDom < 30 ? 'ALT_SEASON' : btcDom > 50 ? 'BTC_DOMINANCE' : 'MIXED';

        return Response.json({
            trending: trending.coins,
            btcDominance: btcDom,
            phase,
            signal: phase === 'ALT_SEASON' ? 'ALTS_BULLISH' : phase === 'BTC_DOMINANCE' ? 'BTC_FOCUS' : 'NEUTRAL',
            timestamp: trending.timestamp
        });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
