// Growth Strategies & Engagement Tips

export const growthStrategies = {
    
    // Optimal posting times (UTC)
    bestTimes: [
        { time: '08:00', day: 'weekday', reason: 'US East Coast waking up' },
        { time: '12:00', day: 'weekday', reason: 'Lunch break activity' },
        { time: '20:00', day: 'weekday', reason: 'Evening engagement peak' },
        { time: '14:00', day: 'weekend', reason: 'Weekend afternoon activity' }
    ],

    // Hashtag strategies
    hashtagSets: {
        mainstream: ['#Crypto', '#Bitcoin', '#Ethereum', '#Blockchain'],
        trading: ['#CryptoTrading', '#DayTrading', '#TechnicalAnalysis', '#Altcoins'],
        community: ['#CryptoCommunity', '#CryptoNews', '#Web3', '#DeFi'],
        trending: ['#BTC', '#ETH', '#Altseason', '#HODL']
    },

    // Engagement hooks
    hooks: [
        '🚨 BREAKING:',
        '🔥 HOT TAKE:',
        '⚠️ ALERT:',
        '💡 PRO TIP:',
        '🎯 PREDICTION:',
        '📊 DATA SHOWS:',
        '🐋 WHALE WATCH:',
        '⚡ QUICK UPDATE:'
    ],

    // Call-to-actions
    ctas: [
        'What do you think? 🤔',
        'Bullish or bearish? 📊',
        'Drop your take below 👇',
        'Who else is watching this? 👀',
        'RT if you agree! 🔄',
        'Thoughts? 💭'
    ],

    // Thread starters
    threadStarters: [
        '🧵 THREAD: Here\'s what you need to know about',
        '📊 ANALYSIS THREAD: Breaking down',
        '🔍 DEEP DIVE: Let\'s explore',
        '💡 QUICK THREAD: 5 things about'
    ]
};

export function getOptimalHashtags(tweetType) {
    const sets = growthStrategies.hashtagSets;
    
    switch(tweetType) {
        case 'analysis':
            return [...sets.trading.slice(0, 2), ...sets.mainstream.slice(0, 2)];
        case 'whale_alert':
            return [...sets.community.slice(0, 2), sets.mainstream[0], sets.mainstream[1]];
        case 'market_open':
            return [...sets.mainstream.slice(0, 3), sets.trading[0]];
        default:
            return sets.mainstream.slice(0, 4);
    }
}

export function addEngagementHook(text) {
    const hooks = growthStrategies.hooks;
    const ctas = growthStrategies.ctas;
    
    const randomHook = hooks[Math.floor(Math.random() * hooks.length)];
    const randomCTA = ctas[Math.floor(Math.random() * ctas.length)];
    
    return `${randomHook} ${text}\n\n${randomCTA}`;
}

// A/B Test different tweet styles
export function getTweetVariant(baseText, variantType = 'standard') {
    switch(variantType) {
        case 'question':
            return baseText + '\n\nWhat\'s your take? 🤔';
        case 'urgent':
            return '🚨 ' + baseText + '\n\nDon\'t miss this!';
        case 'data':
            return '📊 ' + baseText + '\n\nNumbers don\'t lie.';
        case 'emoji_heavy':
            return baseText.replace(/\./g, '.🔥').replace(/!/g, '!🚀');
        default:
            return baseText;
    }
}
