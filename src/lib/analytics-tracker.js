// Analytics & Link Tracking

let clickStats = {
    totalClicks: 0,
    sources: {},
    dates: {},
    urls: {}
};

export function trackClick(source, url) {
    const today = new Date().toISOString().split('T')[0];
    
    clickStats.totalClicks++;
    clickStats.sources[source] = (clickStats.sources[source] || 0) + 1;
    clickStats.dates[today] = (clickStats.dates[today] || 0) + 1;
    clickStats.urls[url] = (clickStats.urls[url] || 0) + 1;
    
    console.log(`📊 Click tracked: ${source} → ${url}`);
    
    return clickStats;
}

export function getAnalytics() {
    return {
        ...clickStats,
        topSources: Object.entries(clickStats.sources)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5),
        last7Days: getLast7Days(),
        conversionRate: calculateConversionRate()
    };
}

function getLast7Days() {
    const last7 = {};
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        last7[dateStr] = clickStats.dates[dateStr] || 0;
    }
    return last7;
}

function calculateConversionRate() {
    // Twitter impressions estimate (avg 100 per tweet)
    const estimatedImpressions = Object.keys(clickStats.sources).length * 100;
    return estimatedImpressions > 0 
        ? ((clickStats.totalClicks / estimatedImpressions) * 100).toFixed(2)
        : '0';
}

// UTM Parameter Generator
export function generateTrackingUrl(baseUrl, source, campaign) {
    const url = new URL(baseUrl);
    url.searchParams.set('utm_source', source);
    url.searchParams.set('utm_medium', 'social');
    url.searchParams.set('utm_campaign', campaign);
    url.searchParams.set('ref', source);
    return url.toString();
}
