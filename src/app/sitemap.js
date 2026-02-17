export default function sitemap() {
    const baseUrl = 'https://pepeline.com';
    const currentDate = new Date().toISOString();

    return [
        {
            url: baseUrl,
            lastModified: currentDate,
            changeFrequency: 'hourly',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/dashboard`,
            lastModified: currentDate,
            changeFrequency: 'hourly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/whitelist`,
            lastModified: currentDate,
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/backtest`,
            lastModified: currentDate,
            changeFrequency: 'daily',
            priority: 0.7,
        },
    ];
}
