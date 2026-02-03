export default async function sitemap() {
  const baseUrl = 'https://pepeline.com';

  // Fetch top coins for individual pages
  let coinUrls = [];
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50'
    );
    const coins = await res.json();
    coinUrls = coins.map(coin => ({
      url: `${baseUrl}/coin/${coin.id}`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.7,
    }));
  } catch (e) {}

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1,
    },
    {
      url: `${baseUrl}/coins`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    ...coinUrls,
  ];
}
