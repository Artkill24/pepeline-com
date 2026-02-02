import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = process.env.GEMINI_API_KEY 
    ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    : null;

export async function generateCoinCommentary(coinData) {
    // Prova Gemini prima
    if (genAI) {
        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
            const prompt = `You're a crypto analyst. Analyze ${coinData.name} (${coinData.symbol}):

Price: $${coinData.price?.toLocaleString()}
24h Change: ${coinData.change24h > 0 ? '+' : ''}${coinData.change24h?.toFixed(2)}%
Sentiment Score: ${coinData.sentiment}/100 (${coinData.level})

Write 2 sentences max:
1. Comment on the price action and sentiment
2. Give a brief outlook
Use crypto slang. No emojis. Under 50 words.`;

            const result = await model.generateContent(prompt);
            const text = result.response.text().trim();
            return text;
        } catch (error) {
            console.log('Gemini unavailable, using enhanced fallback');
        }
    }
    
    return generateSmartFallback(coinData);
}

function generateSmartFallback(coinData) {
    const { sentiment, change24h, level, symbol, name, price } = coinData;
    
    // Genera variazioni basate su coin ID
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const variant = hash % 3;
    
    // Template diversi per range sentiment
    if (sentiment < 20) {
        const templates = [
            `${symbol} deep in fear zone at ${sentiment}. ${change24h < -5 ? 'Sharp selloff continues' : 'Price finding a floor'} around $${formatPrice(price)}. ${variant === 0 ? 'Classic capitulation setup' : variant === 1 ? 'Long-term holders accumulating' : 'Bottom fishing territory'}.`,
            `Extreme fear on ${name} with sentiment at ${sentiment}. ${Math.abs(change24h) > 3 ? 'Volatility elevated' : 'Stabilizing action'}. ${variant === 0 ? 'Patient money wins here' : variant === 1 ? 'Risk/reward improving' : 'Watch for reversal signals'}.`,
            `${symbol} oversold at ${sentiment} sentiment. ${change24h < 0 ? `Down ${Math.abs(change24h).toFixed(1)}% today` : 'Attempting recovery'}. ${variant === 0 ? 'Contrarian opportunity emerging' : variant === 1 ? 'Strong hands accumulating' : 'Panic phase potentially ending'}.`
        ];
        return templates[variant];
    }
    
    if (sentiment < 40) {
        const templates = [
            `${symbol} neutral at ${sentiment}. ${Math.abs(change24h) < 2 ? 'Trading sideways' : change24h > 0 ? 'Slight green candles' : 'Minor red pressure'} near $${formatPrice(price)}. ${variant === 0 ? 'Waiting for catalyst' : variant === 1 ? 'Accumulation phase likely' : 'Coiling for next move'}.`,
            `${name} showing balanced sentiment at ${sentiment}. ${change24h > 2 ? 'Building bullish momentum' : change24h < -2 ? 'Testing support levels' : 'Range-bound action'}. ${variant === 0 ? 'Breakout or breakdown incoming' : variant === 1 ? 'Smart money positioning' : 'Patience required here'}.`,
            `${symbol} calm waters at ${sentiment} sentiment. ${Math.abs(change24h) < 1 ? 'Low volatility consolidation' : 'Slow grinding action'}. ${variant === 0 ? 'Good entry for DCA' : variant === 1 ? 'Base building pattern' : 'Wait for volume confirmation'}.`
        ];
        return templates[variant];
    }
    
    if (sentiment < 60) {
        const templates = [
            `${symbol} active zone at ${sentiment}! ${change24h > 3 ? `Pumping +${change24h.toFixed(1)}%` : change24h < -3 ? `Dumping ${change24h.toFixed(1)}%` : 'Healthy volatility'}. ${variant === 0 ? 'This is where trends start' : variant === 1 ? 'Smart money engaged' : 'Volume confirms interest'}.`,
            `${name} heating up with ${sentiment} sentiment. ${change24h > 0 ? 'Bulls pushing price' : 'Bears testing resolve'} around $${formatPrice(price)}. ${variant === 0 ? 'Momentum building nicely' : variant === 1 ? 'Breakout potential high' : 'Watch the next 24h closely'}.`,
            `${symbol} in sweet spot at ${sentiment}. ${Math.abs(change24h) > 2 ? 'Strong directional move' : 'Steady upward grind'}. ${variant === 0 ? 'Sustainable momentum' : variant === 1 ? 'Not overheated yet' : 'Room to run higher'}.`
        ];
        return templates[variant];
    }
    
    if (sentiment < 80) {
        const templates = [
            `${symbol} entering FOMO at ${sentiment}! ${change24h > 5 ? `Ripping +${change24h.toFixed(1)}%` : 'Hype building fast'}. ${variant === 0 ? 'Take profits on strength' : variant === 1 ? 'Watch for exhaustion' : 'Smart money lightening up'}.`,
            `${name} hyped with ${sentiment} sentiment. ${change24h > 7 ? 'Parabolic move warning' : 'Retail jumping in'}. $${formatPrice(price)} ${variant === 0 ? 'likely near-term top' : variant === 1 ? 'could see pullback' : 'needs cooling off'}.`,
            `FOMO levels on ${symbol} at ${sentiment}. ${change24h > 3 ? 'Vertical price action' : 'Greed taking over'}. ${variant === 0 ? 'Sell into strength' : variant === 1 ? 'Risks building quickly' : 'Don\'t chase here'}.`
        ];
        return templates[variant];
    }
    
    // sentiment >= 80
    const templates = [
        `${symbol} PEAK EUPHORIA at ${sentiment}! ${change24h > 10 ? 'Blow-off top warning' : 'Extreme greed'}. $${formatPrice(price)} ${variant === 0 ? 'unsustainable - exit now' : variant === 1 ? 'screams major correction' : 'is distribution zone'}.`,
        `${name} maxed out at ${sentiment} sentiment. ${change24h > 8 ? 'Parabolic = danger' : 'Everyone is buying'}. ${variant === 0 ? 'This ends badly' : variant === 1 ? 'Be the exit liquidity?' : 'History says sell'}.`,
        `EXTREME GREED on ${symbol} at ${sentiment}. ${Math.abs(change24h) > 5 ? 'Volatile top formation' : 'Mania phase'}. ${variant === 0 ? 'Protect profits NOW' : variant === 1 ? 'Reversal imminent' : 'Last call to exit'}.`
    ];
    return templates[variant];
}

function formatPrice(price) {
    if (!price) return '0';
    if (price < 0.01) return price.toFixed(6);
    if (price < 1) return price.toFixed(4);
    if (price < 100) return price.toFixed(2);
    return price.toLocaleString(undefined, { maximumFractionDigits: 0 });
}
