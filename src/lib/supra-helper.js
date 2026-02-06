// Supra Oracle Integration
// Docs: https://supra.com/docs/data-feeds

const SUPRA_API_BASE = 'https://api.supra.com';

// Supra price feed pairs
const SUPRA_PAIRS = {
    'btc': 'btc_usdt',
    'eth': 'eth_usdt',
    'bnb': 'bnb_usdt',
    'sol': 'sol_usdt',
    'ada': 'ada_usdt',
    'xrp': 'xrp_usdt',
    'doge': 'doge_usdt',
    'matic': 'matic_usdt',
    'dot': 'dot_usdt',
    'avax': 'avax_usdt'
};

export async function getSupraPrices(symbols) {
    try {
        // Convert symbols to Supra pairs
        const pairs = symbols
            .map(s => SUPRA_PAIRS[s.toLowerCase()])
            .filter(Boolean);
        
        if (pairs.length === 0) {
            throw new Error('No valid Supra pairs');
        }
        
        // Supra Pull Oracle API
        const response = await fetch(`${SUPRA_API_BASE}/oracle/v1/price/batch`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                pairs: pairs
            }),
            cache: 'no-store'
        });
        
        if (!response.ok) {
            throw new Error(`Supra API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Transform to standard format
        const prices = {};
        
        for (const [pair, priceData] of Object.entries(data.data || {})) {
            // Find original symbol
            const symbol = Object.entries(SUPRA_PAIRS)
                .find(([k, v]) => v === pair)?.[0];
            
            if (symbol) {
                prices[symbol.toUpperCase()] = {
                    price: parseFloat(priceData.price),
                    timestamp: priceData.timestamp,
                    source: 'supra',
                    confidence: priceData.confidence || 1.0,
                    volume24h: priceData.volume || 0
                };
            }
        }
        
        console.log(`✅ Supra: fetched ${Object.keys(prices).length} prices`);
        return prices;
        
    } catch (error) {
        console.error('❌ Supra error:', error.message);
        return null;
    }
}

export async function getSupraMarketData() {
    try {
        const response = await fetch(`${SUPRA_API_BASE}/oracle/v1/market/summary`, {
            cache: 'no-store'
        });
        
        if (!response.ok) {
            throw new Error('Supra market data unavailable');
        }
        
        const data = await response.json();
        
        return {
            totalMarketCap: data.total_market_cap,
            totalVolume24h: data.total_volume_24h,
            btcDominance: data.btc_dominance,
            activeCryptocurrencies: data.active_cryptocurrencies,
            source: 'supra',
            timestamp: Date.now()
        };
        
    } catch (error) {
        console.error('❌ Supra market data error:', error.message);
        return null;
    }
}

// Supra VRF for randomness (optional - for future features)
export async function getSupraRandomness() {
    try {
        const response = await fetch(`${SUPRA_API_BASE}/vrf/v1/random`, {
            cache: 'no-store'
        });
        
        if (!response.ok) {
            throw new Error('Supra VRF unavailable');
        }
        
        const data = await response.json();
        
        return {
            randomValue: data.random_value,
            proof: data.proof,
            timestamp: data.timestamp
        };
        
    } catch (error) {
        console.error('❌ Supra VRF error:', error.message);
        return null;
    }
}

// Cross-verification: compare Supra vs other sources
export async function verifyCrossSource(symbol, supraPrices, otherPrices) {
    const supraPrice = supraPrices[symbol]?.price;
    const otherPrice = otherPrices[symbol]?.price;
    
    if (!supraPrice || !otherPrice) {
        return { verified: false, reason: 'missing_data' };
    }
    
    const deviation = Math.abs((supraPrice - otherPrice) / otherPrice) * 100;
    
    // Alert if deviation > 2%
    if (deviation > 2) {
        console.warn(`⚠️ Price deviation for ${symbol}: ${deviation.toFixed(2)}%`);
        console.warn(`   Supra: $${supraPrice} | Other: $${otherPrice}`);
    }
    
    return {
        verified: deviation < 5, // 5% threshold
        deviation: deviation.toFixed(2),
        supraPrice,
        otherPrice,
        recommended: deviation < 2 ? 'supra' : 'average'
    };
}

// Get best price from multiple sources
export function getBestPrice(symbol, sources) {
    const prices = [];
    
    if (sources.supra?.[symbol]) {
        prices.push({
            price: sources.supra[symbol].price,
            confidence: sources.supra[symbol].confidence || 1.0,
            source: 'supra'
        });
    }
    
    if (sources.cmc?.[symbol]) {
        prices.push({
            price: sources.cmc[symbol].price,
            confidence: 0.9,
            source: 'cmc'
        });
    }
    
    if (sources.coingecko?.[symbol]) {
        prices.push({
            price: sources.coingecko[symbol].price,
            confidence: 0.85,
            source: 'coingecko'
        });
    }
    
    if (prices.length === 0) return null;
    
    // Weighted average based on confidence
    const totalConfidence = prices.reduce((sum, p) => sum + p.confidence, 0);
    const weightedPrice = prices.reduce(
        (sum, p) => sum + (p.price * p.confidence),
        0
    ) / totalConfidence;
    
    return {
        price: weightedPrice,
        sources: prices.map(p => p.source),
        confidence: totalConfidence / prices.length,
        deviation: Math.max(...prices.map(p => p.price)) - Math.min(...prices.map(p => p.price))
    };
}
