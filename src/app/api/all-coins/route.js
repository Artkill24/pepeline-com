export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const res = await fetch(
            'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=true&price_change_percentage=1h,24h,7d',
            { next: { revalidate: 180 } }
        );

        if (!res.ok) throw new Error('CoinGecko failed');
        
        const data = await res.json();

        const coins = data.map(coin => ({
            id: coin.id,
            symbol: coin.symbol.toUpperCase(),
            name: coin.name,
            image: coin.image,
            current_price: coin.current_price,
            market_cap: coin.market_cap,
            market_cap_rank: coin.market_cap_rank,
            total_volume: coin.total_volume,
            price_change_percentage_1h_in_currency: coin.price_change_percentage_1h_in_currency,
            price_change_percentage_24h: coin.price_change_percentage_24h,
            price_change_percentage_7d_in_currency: coin.price_change_percentage_7d_in_currency,
            circulating_supply: coin.circulating_supply,
            total_supply: coin.total_supply,
            max_supply: coin.max_supply,
            ath: coin.ath,
            ath_change_percentage: coin.ath_change_percentage,
            sparkline: coin.sparkline_in_7d?.price || []
        }));

        return Response.json({
            coins,
            total: coins.length,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
