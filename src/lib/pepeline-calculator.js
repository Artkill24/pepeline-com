import { getSupraPrices } from './supra-helper';

// Existing imports remain the same...

export async function calculatePepelineIndex() {
    console.log('🐸 Calculating Pepeline Index...');
    
    try {
        // Parallel fetch with Supra as priority
        const [
            sentimentScore,
            volatilityScore,
            fomoScore,
            memeScore,
            supraPrices // NEW!
        ] = await Promise.all([
            fetchSentiment(),
            fetchVolatility(),
            fetchFOMO(),
            fetchMemeIntensity(),
            getSupraPrices(['btc', 'eth', 'bnb', 'sol']) // TOP COINS
        ]);
        
        // Log Supra integration
        if (supraPrices) {
            console.log('✅ Supra prices integrated');
            console.log('   BTC:', supraPrices.BTC?.price);
            console.log('   ETH:', supraPrices.ETH?.price);
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
                sentiment: sentimentScore,
                volatility: volatilityScore,
                fomo: fomoScore,
                meme: memeScore
            },
            dataSources: {
                supra: supraPrices ? 'active' : 'unavailable',
                timestamp: new Date().toISOString()
            }
        };
        
    } catch (error) {
        console.error('Index calculation error:', error);
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

// Rest of the file remains the same...
