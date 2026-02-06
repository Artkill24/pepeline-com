export const dynamic = 'force-dynamic';

let TwitterApi;
try {
    TwitterApi = require('twitter-api-v2').TwitterApi;
} catch (e) {
    console.log('⚠️ twitter-api-v2 not installed');
}

function generateSentimentTweet(index, emoji, level, change) {
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

async function postToTwitter(text) {
    if (!TwitterApi) {
        throw new Error('twitter-api-v2 not installed. Run: npm install twitter-api-v2');
    }

    const client = new TwitterApi({
        appKey: process.env.X_API_KEY,
        appSecret: process.env.X_API_SECRET,
        accessToken: process.env.X_ACCESS_TOKEN,
        accessSecret: process.env.X_ACCESS_TOKEN_SECRET,
    });

    try {
        const tweet = await client.v2.tweet(text);
        console.log('✅ Tweet posted:', tweet.data.id);
        return { success: true, id: tweet.data.id };
    } catch (error) {
        console.error('❌ Twitter error:', error);
        let errorMessage = error.message;
        
        if (error.code === 401) {
            errorMessage = 'Invalid Twitter credentials';
        } else if (error.code === 403) {
            errorMessage = 'Access forbidden. Check app permissions';
        } else if (error.code === 429) {
            errorMessage = 'Rate limit exceeded';
        }
        
        return { success: false, error: errorMessage };
    }
}

export async function POST(request) {
    try {
        if (!process.env.X_API_KEY || !process.env.X_ACCESS_TOKEN) {
            return Response.json({ 
                success: false,
                error: 'Twitter credentials not configured' 
            }, { status: 500 });
        }

        const body = await request.json();
        const { type, data } = body;

        let tweetText = '';

        if (type === 'sentiment') {
            tweetText = generateSentimentTweet(
                data.index,
                data.emoji,
                data.level,
                data.change || 0
            );
        } else if (type === 'custom') {
            tweetText = data.text;
        } else {
            return Response.json({ 
                success: false,
                error: 'Invalid type' 
            }, { status: 400 });
        }

        console.log('📝 Posting tweet:', tweetText.substring(0, 50) + '...');

        const result = await postToTwitter(tweetText);
        
        return Response.json(result);

    } catch (error) {
        console.error('❌ Tweet API error:', error);
        return Response.json({ 
            success: false,
            error: error.message 
        }, { status: 500 });
    }
}

export async function GET() {
    return Response.json({ 
        message: 'POST to this endpoint with tweet data',
        status: 'Route is working!',
        twitterApiInstalled: !!TwitterApi,
        requiredEnv: [
            'X_API_KEY',
            'X_API_SECRET', 
            'X_ACCESS_TOKEN',
            'X_ACCESS_TOKEN_SECRET'
        ],
        configured: {
            X_API_KEY: !!process.env.X_API_KEY,
            X_API_SECRET: !!process.env.X_API_SECRET,
            X_ACCESS_TOKEN: !!process.env.X_ACCESS_TOKEN,
            X_ACCESS_TOKEN_SECRET: !!process.env.X_ACCESS_TOKEN_SECRET
        }
    });
}
