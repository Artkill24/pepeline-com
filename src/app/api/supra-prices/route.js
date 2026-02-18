export const dynamic = 'force-dynamic';

const PAIRS = ['btc_usdt', 'eth_usdt', 'sol_usdt', 'bnb_usdt', 'xrp_usdt', 'doge_usdt', 'ada_usdt', 'avax_usdt', 'link_usdt', 'dot_usdt', 'matic_usdt', 'uni_usdt', 'atom_usdt', 'ltc_usdt', 'near_usdt'];

async function fetchSupra(pair) {
    try {
        const res = await fetch(`https://supra-api.onrender.com/api/price/${pair}`, {
            headers: { 'X-API-Key': process.env.SUPRA_API_KEY },
            next: { revalidate: 60 }
        });
        if (!res.ok) return null;
        const data = await res.json();
        return { symbol: pair.split('_')[0].toUpperCase(), pair, ...data };
    } catch { return null; }
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const pair = searchParams.get('pair');

    try {
        if (pair) {
            const data = await fetchSupra(pair);
            return Response.json(data || { error: 'Not found' }, { status: data ? 200 : 404 });
        }

        const results = await Promise.all(PAIRS.map(fetchSupra));
        const prices = results.filter(Boolean);

        return Response.json({
            prices,
            total: prices.length,
            timestamp: new Date().toISOString(),
            source: 'supra'
        });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
