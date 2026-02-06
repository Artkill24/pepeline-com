// Auto-Generated Content Calendar

export const contentTemplates = {
    morning: [
        {
            time: '08:00',
            type: 'market_open',
            template: (data) => `☀️ Good Morning Crypto! 

🐸 Pepeline Index: ${data.index} ${data.emoji}
📊 Market Cap: ${data.mcap}
😱 Fear & Greed: ${data.fng}/100

What are you watching today?

#Crypto #Bitcoin #GoodMorning`
        }
    ],
    
    midday: [
        {
            time: '12:00',
            type: 'analysis',
            template: (data) => `🔍 Midday Analysis

🐋 On-Chain Signal: ${data.onchain}
📈 BTC Dominance: ${data.btcDom}%
⛽ Gas Prices: ${data.gas} Gwei

Live tracker: pepeline.com

#CryptoAnalysis #OnChain`
        }
    ],
    
    evening: [
        {
            time: '20:00',
            type: 'daily_recap',
            template: (data) => `🌙 Daily Crypto Recap

Today's Movement:
📊 Index: ${data.indexChange}
🔝 Top Gainer: ${data.topGainer}
📉 Top Loser: ${data.topLoser}

Tomorrow's outlook: ${data.outlook}

Track 100+ coins: pepeline.com

#CryptoNews #DailyRecap`
        }
    ],
    
    trending: [
        {
            type: 'whale_alert',
            trigger: (data) => data.whaleVolume > 100000000,
            template: (data) => `🐋 WHALE ALERT!

$${(data.whaleVolume / 1e6).toFixed(1)}M moved in last hour
Signal: ${data.whaleSignal}

This could impact prices soon...

Real-time tracking: pepeline.com

#WhaleAlert #Crypto`
        },
        {
            type: 'extreme_sentiment',
            trigger: (data) => data.index > 80 || data.index < 20,
            template: (data) => `⚠️ EXTREME SENTIMENT ALERT

Pepeline Index: ${data.index} ${data.emoji}

${data.index > 80 ? 
    'Market is in EXTREME GREED territory!' : 
    'Market is in EXTREME FEAR territory!'}

History says this ${data.index > 80 ? 'could signal a top' : 'often marks opportunities'}

More: pepeline.com

#CryptoAlert`
        }
    ]
};

export function getScheduledContent(hour) {
    if (hour >= 6 && hour < 10) return contentTemplates.morning;
    if (hour >= 11 && hour < 15) return contentTemplates.midday;
    if (hour >= 18 && hour < 22) return contentTemplates.evening;
    return [];
}

export function checkTrendingTriggers(data) {
    return contentTemplates.trending.filter(template => 
        template.trigger(data)
    );
}
