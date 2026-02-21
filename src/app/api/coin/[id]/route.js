export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
    const { id } = params;

    try {
        // Fetch comprehensive coin data
        const [detailRes, marketRes] = await Promise.all([
            fetch(`https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&community_data=true&developer_data=false&sparkline=true`, {
                next: { revalidate: 300 }
            }),
            fetch(`https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=365`, {
                next: { revalidate: 3600 }
            })
        ]);

        if (!detailRes.ok) throw new Error('Coin not found');

        const detail = await detailRes.json();
        const market = marketRes.ok ? await marketRes.json() : null;

        const coinData = {
            id: detail.id,
            symbol: detail.symbol?.toUpperCase(),
            name: detail.name,
            image: detail.image?.large,
            description: detail.description?.en,
            
            // Market Data
            current_price: detail.market_data?.current_price?.usd,
            market_cap: detail.market_data?.market_cap?.usd,
            market_cap_rank: detail.market_cap_rank,
            total_volume: detail.market_data?.total_volume?.usd,
            
            // Price Changes
            price_change_24h: detail.market_data?.price_change_24h,
            price_change_percentage_24h: detail.market_data?.price_change_percentage_24h,
            price_change_percentage_7d: detail.market_data?.price_change_percentage_7d,
            price_change_percentage_30d: detail.market_data?.price_change_percentage_30d,
            price_change_percentage_1y: detail.market_data?.price_change_percentage_1y,
            
            // Supply
            circulating_supply: detail.market_data?.circulating_supply,
            total_supply: detail.market_data?.total_supply,
            max_supply: detail.market_data?.max_supply,
            
            // ATH/ATL
            ath: detail.market_data?.ath?.usd,
            ath_change_percentage: detail.market_data?.ath_change_percentage?.usd,
            ath_date: detail.market_data?.ath_date?.usd,
            atl: detail.market_data?.atl?.usd,
            atl_change_percentage: detail.market_data?.atl_change_percentage?.usd,
            atl_date: detail.market_data?.atl_date?.usd,
            
            // Links
            homepage: detail.links?.homepage?.[0],
            blockchain_site: detail.links?.blockchain_site?.filter(s => s)?.[0],
            official_forum_url: detail.links?.official_forum_url?.filter(s => s)?.[0],
            twitter_screen_name: detail.links?.twitter_screen_name,
            telegram_channel_identifier: detail.links?.telegram_channel_identifier,
            subreddit_url: detail.links?.subreddit_url,
            repos_url: detail.links?.repos_url?.github?.[0],
            
            // Community
            community: {
                twitter_followers: detail.community_data?.twitter_followers,
                reddit_subscribers: detail.community_data?.reddit_subscribers,
                telegram_channel_user_count: detail.community_data?.telegram_channel_user_count
            },
            
            // Charts
            sparkline_7d: detail.market_data?.sparkline_7d?.price || [],
            price_history: market?.prices || [],
            
            // Categories & Tags
            categories: detail.categories || [],
            
            // Last updated
            last_updated: detail.last_updated
        };

        return Response.json({
            coin: coinData,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
