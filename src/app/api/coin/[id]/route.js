import { calculateRiskScore, getRiskRecommendation } from '@/lib/gemini-risk-analyzer';
import { generateCoinCommentary } from '@/lib/gemini-helper';

export const dynamic = 'force-dynamic';

// CoinGecko ID to CMC Symbol mapping
const CMC_SYMBOLS = {
    'bitcoin': 'BTC',
    'ethereum': 'ETH',
    'binancecoin': 'BNB',
    'ripple': 'XRP',
    'cardano': 'ADA',
    'solana': 'SOL',
    'dogecoin': 'DOGE',
    'polkadot': 'DOT',
    'tron': 'TRX',
    'avalanche-2': 'AVAX',
    'chainlink': 'LINK',
    'uniswap': 'UNI',
    'litecoin': 'LTC',
    'polygon': 'MATIC',
    'shiba-inu': 'SHIB',
    'tether': 'USDT',
    'usd-coin': 'USDC',
};

// Binance WebSocket symbols
const BINANCE_SYMBOLS = {
    'bitcoin': 'BTCUSDT',
    'ethereum': 'ETHUSDT',
    'binancecoin': 'BNBUSDT',
    'ripple': 'XRPUSDT',
    'cardano': 'ADAUSDT',
    'solana': 'SOLUSDT',
    'dogecoin': 'DOGEUSDT',
    'polkadot': 'DOTUSDT',
    'tron': 'TRXUSDT',
    'avalanche-2': 'AVAXUSDT',
    'chainlink': 'LINKUSDT',
    'uniswap': 'UNIUSDT',
    'litecoin': 'LTCUSDT',
};

export async function GET(request, { params }) {
    try {
        let priceSource = 'coingecko';
        let currentPrice = null;
        let marketCap = null;
        let volume = null;
        let change24h = null;
        let change7d = null;
        let change30d = null;
        let high24h = null;
        let low24h = null;
        let coinName = null;
        let coinSymbol = null;
        let coinImage = null;
        let marketCapRank = null;

        // TRY 1: CoinMarketCap (Most accurate + real-time)
        const cmcSymbol = CMC_SYMBOLS[params.id];
        if (cmcSymbol && process.env.CMC_API_KEY) {
            try {
                const cmcResponse = await fetch(
                    `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=${cmcSymbol}`,
                    {
                        headers: {
                            'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY
                        },
                        cache: 'no-store'
                    }
                );
                if (cmcResponse.ok) {
                    const cmcData = await cmcResponse.json();
                    const coinData = cmcData.data[cmcSymbol]?.[0];
                    if (coinData) {
                        currentPrice = coinData.quote.USD.price;
                        marketCap = coinData.quote.USD.market_cap;
                        volume = coinData.quote.USD.volume_24h;
                        change24h = coinData.quote.USD.percent_change_24h;
                        change7d = coinData.quote.USD.percent_change_7d;
                        change30d = coinData.quote.USD.percent_change_30d;
                        coinName = coinData.name;
                        coinSymbol = coinData.symbol;
                        marketCapRank = coinData.cmc_rank;
                        priceSource = 'coinmarketcap';
                        console.log(`✅ CMC data for ${cmcSymbol}`);
                    }
                }
            } catch (e) {
                console.log('CMC fetch failed:', e.message);
            }
        }

        // TRY 2: Binance (Real-time price only)
        if (!currentPrice) {
            const binanceSymbol = BINANCE_SYMBOLS[params.id];
            if (binanceSymbol) {
                try {
                    const binanceResponse = await fetch(
                        `https://api.binance.com/api/v3/ticker/24hr?symbol=${binanceSymbol}`,
                        { cache: 'no-store' }
                    );
                    if (binanceResponse.ok) {
                        const binanceData = await binanceResponse.json();
                        currentPrice = parseFloat(binanceData.lastPrice);
                        change24h = parseFloat(binanceData.priceChangePercent);
                        high24h = parseFloat(binanceData.highPrice);
                        low24h = parseFloat(binanceData.lowPrice);
                        volume = parseFloat(binanceData.quoteVolume);
                        priceSource = 'binance';
                        console.log(`✅ Binance data for ${binanceSymbol}`);
                    }
                } catch (e) {
                    console.log('Binance fetch failed:', e.message);
                }
            }
        }

        // TRY 3: CoinGecko (Fallback - OPTIONAL)
        let coin = null;
        try {
            const coinResponse = await fetch(
                `https://api.coingecko.com/api/v3/coins/${params.id}?localization=false&tickers=false`,
                { 
                    cache: 'no-store',
                    signal: AbortSignal.timeout(5000) // 5 second timeout
                }
            );
            if (coinResponse.ok) {
                coin = await coinResponse.json();
                console.log('✅ CoinGecko data available');
                
                // Fill missing data from CoinGecko
                if (!currentPrice) {
                    currentPrice = coin.market_data?.current_price?.usd;
                    priceSource = 'coingecko';
                }
                if (!marketCap) marketCap = coin.market_data?.market_cap?.usd;
                if (!volume) volume = coin.market_data?.total_volume?.usd;
                if (!change24h) change24h = coin.market_data?.price_change_percentage_24h;
                if (!change7d) change7d = coin.market_data?.price_change_percentage_7d;
                if (!change30d) change30d = coin.market_data?.price_change_percentage_30d;
                if (!high24h) high24h = coin.market_data?.high_24h?.usd;
                if (!low24h) low24h = coin.market_data?.low_24h?.usd;
                if (!coinName) coinName = coin.name;
                if (!coinSymbol) coinSymbol = coin.symbol?.toUpperCase();
                if (!coinImage) coinImage = coin.image?.large;
                if (!marketCapRank) marketCapRank = coin.market_cap_rank;
            }
        } catch (e) {
            console.log('⚠️ CoinGecko unavailable (timeout/rate limit), continuing with CMC/Binance data');
        }

        // Verify we have minimum required data
        if (!currentPrice) {
            return Response.json({ 
                error: 'No price data available from any source' 
            }, { status: 500 });
        }

        // Set defaults for missing data
        if (!coinName) coinName = params.id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        if (!coinSymbol) coinSymbol = params.id.substring(0, 4).toUpperCase();
        if (!coinImage) coinImage = `https://via.placeholder.com/128?text=${coinSymbol}`;
        if (!change24h) change24h = 0;
        if (!high24h) high24h = currentPrice * 1.05;
        if (!low24h) low24h = currentPrice * 0.95;

        // Fetch 7 days chart from CoinGecko (OPTIONAL)
        let chartData = { prices: [] };
        try {
            const chartResponse = await fetch(
                `https://api.coingecko.com/api/v3/coins/${params.id}/market_chart?vs_currency=usd&days=7&interval=hourly`,
                { 
                    cache: 'no-store',
                    signal: AbortSignal.timeout(5000)
                }
            );
            if (chartResponse.ok) {
                chartData = await chartResponse.json();
            }
        } catch (e) {
            console.log('⚠️ Chart data unavailable, using fallback');
        }
        
        // SENTIMENT - Pure calculation (NO RANDOM)
        let score = 50;
        score += Math.min(Math.max(change24h * 2, -30), 30);
        score = Math.max(0, Math.min(100, score));
        
        let level, emoji;
        if (score < 20) { level = 'Calm'; emoji = '🟢'; }
        else if (score < 40) { level = 'Neutral'; emoji = '🔵'; }
        else if (score < 60) { level = 'Active'; emoji = '🟡'; }
        else if (score < 80) { level = 'Hyped'; emoji = '🟠'; }
        else { level = 'Peak Degen'; emoji = '🔴'; }
        
        const coinData = {
            id: params.id,
            symbol: coinSymbol,
            name: coinName,
            image: coinImage,
            price: currentPrice,
            priceSource,
            change24h,
            change7d: change7d || 0,
            change30d: change30d || 0,
            marketCap: marketCap || 0,
            marketCapRank: marketCapRank || 999,
            volume: volume || 0,
            high24h,
            low24h,
            sentiment: Math.round(score * 100) / 100,
            level,
            emoji
        };
        
        // Calculate risk
        const risk = calculateRiskScore(coinData);
        const riskRec = getRiskRecommendation(risk.score, coinData.sentiment);
        
        // Generate AI commentary
        const commentary = await generateCoinCommentary(coinData);
        
        // Process chart data
        const priceHistory = chartData.prices?.map(([timestamp, price]) => ({
            time: new Date(timestamp).toLocaleString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                hour: '2-digit' 
            }),
            price: Math.round(price * 100) / 100,
            timestamp
        })) || [];

        // If no chart data, generate simple fallback
        if (priceHistory.length === 0) {
            const now = Date.now();
            for (let i = 0; i < 24; i++) {
                priceHistory.push({
                    time: new Date(now - (24 - i) * 3600000).toLocaleString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        hour: '2-digit' 
                    }),
                    price: currentPrice * (1 + (Math.random() - 0.5) * 0.1),
                    timestamp: now - (24 - i) * 3600000
                });
            }
        }

        // Calculate volatility
        const prices = priceHistory.map(p => p.price);
        const maxPrice = prices.length > 0 ? Math.max(...prices) : currentPrice;
        const minPrice = prices.length > 0 ? Math.min(...prices) : currentPrice;
        const avgPrice = prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : currentPrice;
        const volatility = avgPrice > 0 ? ((maxPrice - minPrice) / avgPrice) * 100 : 0;

        // AI Live Analysis
        const liveAnalysis = generateLiveAnalysis({
            symbol: coinData.symbol,
            price: coinData.price || 0,
            change24h: coinData.change24h || 0,
            volatility,
            sentiment: coinData.sentiment,
            level: coinData.level,
            high7d: maxPrice,
            low7d: minPrice,
            avgPrice
        });

        return Response.json({
            ...coinData,
            commentary,
            risk: { ...risk, recommendation: riskRec },
            chart: {
                priceHistory,
                volatility: Math.round(volatility * 100) / 100,
                high7d: maxPrice,
                low7d: minPrice,
                avg7d: Math.round(avgPrice * 100) / 100
            },
            liveAnalysis,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Coin detail error:', error);
        return Response.json({ error: 'Failed to fetch coin data' }, { status: 500 });
    }
}

function generateLiveAnalysis({ symbol, price, change24h, volatility, sentiment, level, high7d, low7d, avgPrice }) {
    const analyses = [];

    if (!symbol || price === undefined || price === null) {
        return [{
            type: 'info',
            icon: '📊',
            title: 'Data Loading',
            text: 'Analysis will appear once data is fully loaded.'
        }];
    }

    const priceVsAvg = avgPrice > 0 ? ((price - avgPrice) / avgPrice) * 100 : 0;
    if (priceVsAvg > 5) {
        analyses.push({
            type: 'price',
            icon: '📈',
            title: 'Above 7-Day Average',
            text: `${symbol} is trading ${priceVsAvg.toFixed(1)}% above its 7-day average. ${priceVsAvg > 10 ? 'Strong momentum but watch for resistance.' : 'Healthy uptrend.'}`
        });
    } else if (priceVsAvg < -5) {
        analyses.push({
            type: 'price',
            icon: '📉',
            title: 'Below 7-Day Average',
            text: `${symbol} is ${Math.abs(priceVsAvg).toFixed(1)}% below its 7-day average. ${Math.abs(priceVsAvg) > 10 ? 'Potential dip-buying opportunity.' : 'Minor pullback.'}`
        });
    }

    if (volatility > 20) {
        analyses.push({
            type: 'volatility',
            icon: '⚡',
            title: 'High Volatility Alert',
            text: `${volatility.toFixed(1)}% price swing in 7 days. Expect continued wild moves. Use tight stops and smaller positions.`
        });
    } else if (volatility < 5) {
        analyses.push({
            type: 'volatility',
            icon: '💤',
            title: 'Low Volatility',
            text: `Only ${volatility.toFixed(1)}% movement in 7 days. Consolidation phase. Breakout likely coming - set alerts.`
        });
    } else {
        analyses.push({
            type: 'volatility',
            icon: '📊',
            title: 'Normal Volatility',
            text: `${volatility.toFixed(1)}% swing is healthy for crypto. Good conditions for position building.`
        });
    }

    if (change24h > 5 && sentiment > 60) {
        analyses.push({
            type: 'momentum',
            icon: '🚀',
            title: 'Strong Bullish Momentum',
            text: `Up ${change24h.toFixed(1)}% with ${sentiment} sentiment. FOMO building. Consider taking partial profits or trailing stops.`
        });
    } else if (change24h < -5 && sentiment < 40) {
        analyses.push({
            type: 'momentum',
            icon: '🔻',
            title: 'Bearish Pressure',
            text: `Down ${Math.abs(change24h).toFixed(1)}% with ${sentiment} sentiment. Fear is high. DCA or wait for capitulation.`
        });
    } else if (Math.abs(change24h) < 2 && sentiment > 40 && sentiment < 60) {
        analyses.push({
            type: 'momentum',
            icon: '⚖️',
            title: 'Balanced Market',
            text: `Minimal movement with neutral sentiment. Market is undecided. Wait for volume confirmation before entry.`
        });
    }

    if (high7d && low7d && low7d > 0) {
        const range = ((high7d - low7d) / low7d) * 100;
        const formattedHigh = high7d.toLocaleString(undefined, { maximumFractionDigits: 2 });
        const formattedLow = low7d.toLocaleString(undefined, { maximumFractionDigits: 2 });
        analyses.push({
            type: 'range',
            icon: '📏',
            title: '7-Day Trading Range',
            text: `${range.toFixed(1)}% range from $${formattedLow} to $${formattedHigh}. ${price > avgPrice ? 'Trading near highs.' : 'Trading near lows.'}`
        });
    }

    if (sentiment > 70 && change24h < 0) {
        analyses.push({
            type: 'divergence',
            icon: '⚠️',
            title: 'Sentiment-Price Divergence',
            text: 'High sentiment but price dropping. Could signal distribution or fakeout. Be cautious.'
        });
    } else if (sentiment < 30 && change24h > 0) {
        analyses.push({
            type: 'divergence',
            icon: '💡',
            title: 'Bullish Divergence',
            text: 'Low sentiment but price rising. Smart money accumulating? Watch for trend reversal.'
        });
    }

    if (analyses.length === 0) {
        analyses.push({
            type: 'info',
            icon: '📊',
            title: 'Market Watch',
            text: `${symbol} showing typical crypto behavior. Monitor for breakout signals.`
        });
    }

    return analyses;
}
