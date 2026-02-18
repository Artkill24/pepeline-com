export const dynamic = 'force-dynamic';

async function fetchPrices() {
    try {
        const res = await fetch(
            'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h',
            { next: { revalidate: 180 } }
        );
        
        if (!res.ok) throw new Error('Failed');
        const coins = await res.json();
        
        return coins.map(c => ({
            symbol: c.symbol.toUpperCase(),
            name: c.name,
            price: c.current_price,
            high24h: c.high_24h,
            low24h: c.low_24h,
            change24h: c.price_change_percentage_24h || 0,
            volume24h: c.total_volume || 0,
            marketCap: c.market_cap || 0
        }));
    } catch {
        return [];
    }
}

export async function GET() {
    try {
        const prices = await fetchPrices();
        return Response.json({
            prices,
            total: prices.length,
            timestamp: new Date().toISOString(),
            source: 'coingecko'
        });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
