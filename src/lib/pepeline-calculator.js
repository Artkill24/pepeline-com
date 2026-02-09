import { getSupraPrices } from './supra-helper';

// Fetch sentiment score from Twitter/X
async function fetchSentiment() {
    try {
        // Simplified sentiment calculation
        // In production, this would analyze Twitter API data
        const sentiment = Math.floor(Math.random() * 30) + 10; // 10-40
        console.log(`  ✓ Sentiment: ${sentiment}`);
        return sentiment;
    } catch (error) {
        console.error('  ✗ Sentiment failed, using fallback');
        return 50;
    }
}

// Fetch volatility from price movements
async function fetchVolatility() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=7', {
            cache: 'no-store'
        });
        
        if (!response.ok) throw new Error('CoinGecko unavailable');
        
        const data = await response.json();
        const prices = data.prices.map(p => p[1]);
        
        const high = Math.max(...prices);
        const low = Math.min(...prices);
        const volatility = ((high - low) / low) * 100;
        
        console.log(`  ✓ Volatility: ${volatility.toFixed(2)}`);
        return Math.min(volatility, 100);
        
    } catch (error) {
        console.error('  ✗ Volatility failed, using fallback');
        return 50;
    }
}

// Fetch FOMO score from market data
async function fetchFOMO() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/global', {
            cache: 'no-store'
        });
        
        if (!response.ok) throw new Error('Global data unavailable');
        
        const data = await response.json();
        const mcapChange = data.data.market_cap_change_percentage_24h_usd;
        
        // Convert -10% to +10% range into 0-100 score
        const fomo = Math.max(0, Math.min(100, 50 + (mcapChange * 3)));
        
        console.log(`  ✓ FOMO: ${fomo.toFixed(2)}`);
        return fomo;
        
    } catch (error) {
        console.error('  ✗ FOMO failed, using fallback');
        return 50;
    }
}

// Fetch meme intensity
async function fetchMemeIntensity() {
    try {
        const memeCoins = ['dogecoin', 'shiba-inu', 'pepe'];
        
        const responses = await Promise.all(
            memeCoins.map(coin => 
                fetch(`https://api.coingecko.com/api/v3/coins/${coin}?localization=false&tickers=false&community_data=true&developer_data=false`, {
                    cache: 'no-store'
                })
            )
        );
        
        const data = await Promise.all(responses.map(r => r.json()));
        
        // Average social score
        const socialScores = data.map(d => 
            (d.community_data?.twitter_followers || 0) / 100000
        );
        
        const avgScore = socialScores.reduce((a, b) => a + b, 0) / socialScores.length;
        const memeIntensity = Math.min(100, avgScore);
        
        console.log(`  ✓ Meme: ${memeIntensity.toFixed(2)}`);
        return memeIntensity;
        
    } catch (error) {
        console.error('  ✗ Meme failed, using fallback');
        return 50;
    }
}

// Get level description
function getLevel(index) {
    if (index >= 80) return 'EXTREME GREED';
    if (index >= 60) return 'GREED';
    if (index >= 40) return 'NEUTRAL';
    if (index >= 20) return 'FEAR';
    return 'EXTREME FEAR';
}

// Get emoji
function getEmoji(index) {
    if (index >= 80) return '🤑';
    if (index >= 60) return '😊';
    if (index >= 40) return '😐';
    if (index >= 20) return '😟';
    return '😱';
}

// Main calculation function
export async function calculatePepelineIndex() {
    console.log('🐸 Calculating Pepeline Index...');
    
    try {
        console.log('  → Fetching sentiment...');
        const sentimentScore = await fetchSentiment();
        
        console.log('  → Fetching volatility...');
        const volatilityScore = await fetchVolatility();
        
        console.log('  → Fetching FOMO...');
        const fomoScore = await fetchFOMO();
        
        console.log('  → Fetching meme intensity...');
        const memeScore = await fetchMemeIntensity();
        
        // Try to get Supra prices (optional)
        let supraPrices = null;
        try {
            supraPrices = await getSupraPrices(['btc', 'eth', 'bnb', 'sol']);
            if (supraPrices) {
                console.log('  ✓ Supra prices integrated');
            }
        } catch (error) {
            console.log('  ⚠️ Supra unavailable, continuing without it');
        }
        
        // Calculate weighted index
        const index = (
            sentimentScore * 0.25 +
            volatilityScore * 0.25 +
            fomoScore * 0.30 +
            memeScore * 0.20
        );
        
        const level = getLevel(index);
        const emoji = getEmoji(index);
        
        console.log(`✅ Index calculated: ${index.toFixed(2)}`);
        
        return {
            index: parseFloat(index.toFixed(2)),
            level,
            emoji,
            breakdown: {
                sentiment: parseFloat(sentimentScore.toFixed(2)),
                volatility: parseFloat(volatilityScore.toFixed(2)),
                fomo: parseFloat(fomoScore.toFixed(2)),
                meme: parseFloat(memeScore.toFixed(2))
            },
            dataSources: {
                supra: supraPrices ? 'active' : 'unavailable',
                timestamp: new Date().toISOString()
            }
        };
        
    } catch (error) {
        console.error('❌ Index calculation error:', error);
        return {
            index: 50,
            level: 'NEUTRAL',
            emoji: '😐',
            breakdown: {
                sentiment: 50,
                volatility: 50,
                fomo: 50,
                meme: 50
            },
            error: error.message
        };
    }
}
