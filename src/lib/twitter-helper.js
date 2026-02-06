let TwitterApi;

// Dynamic import to handle missing package
try {
    TwitterApi = require('twitter-api-v2').TwitterApi;
} catch (error) {
    console.error('⚠️ twitter-api-v2 not installed. Run: npm install twitter-api-v2');
}

let twitterClient = null;

function getTwitterClient() {
    if (!TwitterApi) {
        throw new Error('twitter-api-v2 package not installed');
    }

    if (!twitterClient) {
        if (!process.env.X_API_KEY || !process.env.X_ACCESS_TOKEN) {
            throw new Error('Twitter credentials not configured in .env.local');
        }

        twitterClient = new TwitterApi({
            appKey: process.env.X_API_KEY,
            appSecret: process.env.X_API_SECRET,
            accessToken: process.env.X_ACCESS_TOKEN,
            accessSecret: process.env.X_ACCESS_TOKEN_SECRET,
        });
    }
    return twitterClient;
}

export async function postToTwitter(text) {
    try {
        const client = getTwitterClient();
        const tweet = await client.v2.tweet(text);
        console.log('✅ Tweet posted successfully:', tweet.data.id);
        return { success: true, id: tweet.data.id };
    } catch (error) {
        console.error('❌ Twitter API error:', error);
        
        // Better error messages
        let errorMessage = error.message;
        if (error.code === 401) {
            errorMessage = 'Invalid Twitter credentials. Check your API keys.';
        } else if (error.code === 403) {
            errorMessage = 'Access forbidden. Make sure your app has write permissions.';
        } else if (error.code === 429) {
            errorMessage = 'Rate limit exceeded. Try again later.';
        }
        
        return { success: false, error: errorMessage };
    }
}

export function generateSentimentTweet(index, emoji, level, change) {
    const templates = [
        `🐸 Pepeline Index: ${index}

${emoji} ${level}

${change > 0 ? '📈' : '📉'} ${change > 0 ? '+' : ''}${change.toFixed(1)}% from last check

Track live sentiment at pepeline.com`,

        `Crypto sentiment update! 🚀

${emoji} ${level} (${index})
${change > 0 ? 'Heating up!' : 'Cooling down'}

Real-time tracking: pepeline.com`,

        `🐸 Market vibe check:

Pepeline Index: ${index}
Level: ${emoji} ${level}
Movement: ${change > 0 ? '↗' : '↘'} ${Math.abs(change).toFixed(1)}%

Follow live at pepeline.com`
    ];

    return templates[Math.floor(Math.random() * templates.length)];
}

export function generateCoinAlertTweet(coinName, coinSymbol, sentiment, change24h, price) {
    const emoji = sentiment > 80 ? '🔥' : sentiment > 60 ? '🚀' : sentiment < 20 ? '😴' : '📊';
    
    return `${emoji} ${coinName} ($${coinSymbol}) Alert!

Sentiment: ${sentiment}
Price: $${price.toLocaleString()}
24h: ${change24h > 0 ? '+' : ''}${change24h.toFixed(2)}%

Track on Pepeline: pepeline.com/coin/${coinName.toLowerCase()}`;
}
