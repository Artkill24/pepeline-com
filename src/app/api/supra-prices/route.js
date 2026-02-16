export const dynamic = 'force-dynamic';

const SUPRA_BASE = 'https://prod-kline-rest.supra.com';
const API_KEY    = process.env.SUPRA_API_KEY;

// Le coppie che vuoi trackare in Pepeline
const PAIRS = [
    'btc_usdt', 'eth_usdt', 'sol_usdt', 'bnb_usdt',
    'xrp_usdt', 'doge_usdt', 'ada_usdt', 'avax_usdt',
    'link_usdt', 'matic_usdt',
];

async function fetchLatest(pair) {
    try {
        const res = await fetch(`${SUPRA_BASE}/latest?trading_pair=${pair}`, {
            headers: { 'x-api-key': API_KEY },
            next: { revalidate: 30 }, // cache 30s
        });
        if (!res.ok) return null;
        const data = await res.json();
        const inst  = data.instruments?.[0];
        if (!inst) return null;

        return {
            pair,
            symbol:    pair.split('_')[0].toUpperCase(),
            price:     parseFloat(inst.currentPrice),
            high24h:   parseFloat(inst['24h_high']),
            low24h:    parseFloat(inst['24h_low']),
            change24h: parseFloat(inst['24h_change']),
            timestamp: inst.timestamp,
        };
    } catch (_) {
        return null;
    }
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const pair = searchParams.get('pair');

    // Single pair
    if (pair) {
        const data = await fetchLatest(pair);
        if (!data) return Response.json({ error: 'pair not found' }, { status: 404 });
        return Response.json(data);
    }

    // All pairs in parallel
    const results = await Promise.all(PAIRS.map(fetchLatest));
    const prices  = results.filter(Boolean);

    return Response.json({
        source:    'supra',
        count:     prices.length,
        prices,
        fetched_at: new Date().toISOString(),
    });
}
