export const dynamic = 'force-dynamic';

// Cache in-memory per 10 minuti (Moralis free = 10M req/mese, è sufficiente)
let _cache = null;
let _cacheTime = 0;
const CACHE_TTL = 600_000; // 10 minuti

const MORALIS_API_KEY = process.env.MORALIS_API_KEY;

async function fetchMoralisHottest() {
    const res = await fetch(
        'https://deep-index.moralis.io/api/v2.2/market-data/nfts/hottest-collections',
        {
            headers: {
                'accept': 'application/json',
                'X-API-Key': MORALIS_API_KEY
            },
            signal: AbortSignal.timeout(12000)
        }
    );
    if (!res.ok) throw new Error(`Moralis ${res.status}`);
    return res.json();
}

async function fetchMoralisTopByMarketCap() {
    const res = await fetch(
        'https://deep-index.moralis.io/api/v2.2/market-data/nfts/top-collections',
        {
            headers: {
                'accept': 'application/json',
                'X-API-Key': MORALIS_API_KEY
            },
            signal: AbortSignal.timeout(12000)
        }
    );
    if (!res.ok) throw new Error(`Moralis top ${res.status}`);
    return res.json();
}

function calcHypeScore(col) {
    // Punteggio 0-100 basato su volume change e floor change
    const volChange = parseFloat(col.volume_24hr_percent_change || 0);
    const floorChange = parseFloat(col.floor_price_24hr_percent_change || 0);
    const rank = col.rank || 10;

    // Base score da rank (1° = 80 punti, 10° = 50)
    const rankScore = Math.max(50, 85 - (rank - 1) * 3.5);
    // Bonus volume
    const volBonus = Math.min(15, Math.max(-15, volChange * 0.3));
    // Bonus floor
    const floorBonus = Math.min(10, Math.max(-10, floorChange * 0.2));

    const raw = rankScore + volBonus + floorBonus;
    return Math.round(Math.max(0, Math.min(100, raw)));
}

function getHypeLevel(score) {
    if (score >= 80) return { label: 'PEAK DEGEN', emoji: '🔥', color: 'from-red-500 to-orange-500' };
    if (score >= 65) return { label: 'HYPED',      emoji: '🚀', color: 'from-orange-500 to-yellow-500' };
    if (score >= 50) return { label: 'ACTIVE',     emoji: '📈', color: 'from-yellow-500 to-green-500' };
    if (score >= 35) return { label: 'NEUTRAL',    emoji: '😐', color: 'from-blue-500 to-indigo-500' };
    return            { label: 'COLD',        emoji: '🧊', color: 'from-indigo-500 to-purple-500' };
}

export async function GET() {
    if (!MORALIS_API_KEY) {
        return Response.json({ error: 'MORALIS_API_KEY not configured' }, { status: 503 });
    }

    const now = Date.now();
    if (_cache && now - _cacheTime < CACHE_TTL) {
        return Response.json({ ..._cache, cached: true });
    }

    try {
        const [hottest, topByMcap] = await Promise.allSettled([
            fetchMoralisHottest(),
            fetchMoralisTopByMarketCap()
        ]);

        const hottestData = hottest.status === 'fulfilled' ? (hottest.value || []) : [];
        const mcapData = topByMcap.status === 'fulfilled' ? (topByMcap.value || []) : [];

        // Usa hottest come primario, arricchisce con mcap se possibile
        const collections = hottestData.slice(0, 10).map((col, i) => {
            const hypeScore = calcHypeScore({ ...col, rank: i + 1 });
            const { label, emoji, color } = getHypeLevel(hypeScore);
            return {
                rank: i + 1,
                name: col.collection_title || col.name || `Collection #${i + 1}`,
                image: col.collection_image || col.image || null,
                floorPrice: parseFloat(col.floor_price_usd || 0),
                floorChange24h: parseFloat(col.floor_price_24hr_percent_change || 0),
                volume24h: parseFloat(col.volume_usd || 0),
                volumeChange24h: parseFloat(col.volume_24hr_percent_change || 0),
                avgPrice: parseFloat(col.average_price_usd || 0),
                hypeScore,
                hypeLabel: label,
                hypeEmoji: emoji,
                hypeColor: color,
            };
        });

        // Se non abbiamo dati sufficienti da hottest, usa mcap
        const finalCollections = collections.length > 0 ? collections :
            mcapData.slice(0, 10).map((col, i) => {
                const hypeScore = calcHypeScore({ ...col, rank: i + 1 });
                const { label, emoji, color } = getHypeLevel(hypeScore);
                return {
                    rank: i + 1,
                    name: col.collection_title || col.name || `Collection #${i + 1}`,
                    image: col.collection_image || null,
                    floorPrice: parseFloat(col.floor_price_usd || 0),
                    floorChange24h: 0,
                    volume24h: parseFloat(col.volume_usd || 0),
                    volumeChange24h: 0,
                    avgPrice: parseFloat(col.average_price_usd || 0),
                    hypeScore,
                    hypeLabel: label,
                    hypeEmoji: emoji,
                    hypeColor: color,
                };
            });

        // Stats aggregate
        const avgHype = finalCollections.length > 0
            ? Math.round(finalCollections.reduce((s, c) => s + c.hypeScore, 0) / finalCollections.length)
            : 50;
        const totalVolume = finalCollections.reduce((s, c) => s + c.volume24h, 0);

        const result = {
            collections: finalCollections,
            stats: {
                avgHypeScore: avgHype,
                totalVolume24h: totalVolume,
                marketSignal: avgHype > 65 ? 'BULLISH NFT MARKET' : avgHype > 45 ? 'MIXED' : 'QUIET MARKET',
                signalEmoji: avgHype > 65 ? '🔥' : avgHype > 45 ? '⚖️' : '🧊',
            },
            timestamp: new Date().toISOString()
        };

        _cache = result;
        _cacheTime = now;
        return Response.json(result);

    } catch (error) {
        console.error('NFT trending error:', error.message);
        if (_cache) return Response.json({ ..._cache, stale: true });
        return Response.json({ error: error.message, collections: [] }, { status: 500 });
    }
}
