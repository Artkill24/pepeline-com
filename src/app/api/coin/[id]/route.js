import { calculateRiskScore, getRiskRecommendation } from '@/lib/gemini-risk-analyzer';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
    try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${params.id}?localization=false&tickers=false`);
        if (!response.ok) throw new Error('Failed');
        const coin = await response.json();
        
        const change = coin.market_data?.price_change_percentage_24h || 0;
        let score = 50 + Math.min(Math.max(change * 2, -30), 30) + (Math.random() - 0.5) * 10;
        score = Math.max(0, Math.min(100, score));
        
        let level, emoji;
        if (score < 20) { level = 'Calm'; emoji = '🟢'; }
        else if (score < 40) { level = 'Neutral'; emoji = '🔵'; }
        else if (score < 60) { level = 'Active'; emoji = '🟡'; }
        else if (score < 80) { level = 'Hyped'; emoji = '🟠'; }
        else { level = 'Peak Degen'; emoji = '🔴'; }
        
        const coinData = {
            id: coin.id,
            symbol: coin.symbol?.toUpperCase(),
            name: coin.name,
            image: coin.image?.large,
            price: coin.market_data?.current_price?.usd,
            change24h: coin.market_data?.price_change_percentage_24h,
            change7d: coin.market_data?.price_change_percentage_7d,
            change30d: coin.market_data?.price_change_percentage_30d,
            marketCap: coin.market_data?.market_cap?.usd,
            volume: coin.market_data?.total_volume?.usd,
            sentiment: Math.round(score * 100) / 100,
            level,
            emoji
        };
        
        // Calculate risk
        const risk = calculateRiskScore(coinData);
        const riskRec = getRiskRecommendation(risk.score, coinData.sentiment);
        
        // Simple commentary
        let commentary = `${coinData.symbol} is ${level.toLowerCase()}. `;
        if (score < 40) commentary += "Could be accumulation time.";
        else if (score < 60) commentary += "Healthy activity levels.";
        else commentary += "FOMO levels rising. Watch for exhaustion.";

        return Response.json({
            ...coinData,
            commentary,
            risk: {
                ...risk,
                recommendation: riskRec
            }
        });
    } catch (error) {
        return Response.json({ error: 'Failed' }, { status: 500 });
    }
}
