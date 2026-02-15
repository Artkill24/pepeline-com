// Pepeline Index Calculator — powered by Alchemy + Fear & Greed

import { getGasPrices, getWhaleMovements, getNetworkHealth } from './onchain-analyzer.js';

async function fetchSentiment() {
    try {
        const response = await fetch('https://api.alternative.me/fng/?limit=1', {
            headers: { 'Accept': 'application/json' },
            cache: 'no-store',
            signal: AbortSignal.timeout(15000)
        });
        if (!response.ok) throw new Error('FNG unavailable');
        const data = await response.json();
        const value = parseInt(data.data[0].value, 10);
        console.log(`  ✓ Sentiment: ${value} (${data.data[0].value_classification})`);
        return value;
    } catch (error) {
        console.error(`  ✗ Sentiment failed: ${error.message}`);
        return 30;
    }
}

async function fetchVolatility() {
    try {
        const gas = await getGasPrices();
        const gwei = gas.safe || 0;
        let volatility;
        if (gwei > 100)      volatility = 95;
        else if (gwei > 60)  volatility = 80;
        else if (gwei > 30)  volatility = 65;
        else if (gwei > 15)  volatility = 45;
        else if (gwei > 5)   volatility = 25;
        else                 volatility = 10;
        console.log(`  ✓ Volatility: ${volatility} (gas: ${gwei} gwei, ${gas.congestion})`);
        return volatility;
    } catch (error) {
        console.error(`  ✗ Volatility failed: ${error.message}`);
        return 25;
    }
}

async function fetchFOMO() {
    try {
        const whales = await getWhaleMovements();
        const fomoScore = whales.whaleScore;
        console.log(`  ✓ FOMO: ${fomoScore} (whale signal: ${whales.signal})`);
        return fomoScore;
    } catch (error) {
        console.error(`  ✗ FOMO failed: ${error.message}`);
        return 40;
    }
}

async function fetchMemeIntensity() {
    try {
        const network = await getNetworkHealth();
        const utilization = network.utilization || 0;
        const memeIntensity = Math.max(10, Math.min(90, 20 + (utilization * 0.7)));
        console.log(`  ✓ Meme: ${memeIntensity.toFixed(0)} (block utilization: ${utilization}%)`);
        return parseFloat(memeIntensity.toFixed(2));
    } catch (error) {
        console.error(`  ✗ Meme failed: ${error.message}`);
        return 40;
    }
}

function getLevel(index) {
    if (index >= 80) return 'EXTREME GREED';
    if (index >= 60) return 'GREED';
    if (index >= 40) return 'NEUTRAL';
    if (index >= 20) return 'FEAR';
    return 'EXTREME FEAR';
}

function getEmoji(index) {
    if (index >= 80) return '🤑';
    if (index >= 60) return '😊';
    if (index >= 40) return '😐';
    if (index >= 20) return '😟';
    return '😱';
}

export async function calculatePepelineIndex() {
    console.log('🐸 Calculating Pepeline Index...');
    try {
        console.log('  → Fetching sentiment (Fear & Greed)...');
        const sentimentScore = await fetchSentiment();
        console.log('  → Fetching volatility (Alchemy gas)...');
        const volatilityScore = await fetchVolatility();
        console.log('  → Fetching FOMO (Alchemy whales)...');
        const fomoScore = await fetchFOMO();
        console.log('  → Fetching meme intensity (Alchemy network)...');
        const memeScore = await fetchMemeIntensity();

        const index = (sentimentScore * 0.25 + volatilityScore * 0.25 + fomoScore * 0.30 + memeScore * 0.20);
        const level = getLevel(index);
        const emoji = getEmoji(index);

        console.log(`✅ Index calculated: ${index.toFixed(2)} — ${level}`);

        return {
            index: parseFloat(index.toFixed(2)),
            level, emoji,
            breakdown: {
                sentiment: parseFloat(sentimentScore.toFixed(2)),
                volatility: parseFloat(volatilityScore.toFixed(2)),
                fomo: parseFloat(fomoScore.toFixed(2)),
                meme: parseFloat(memeScore.toFixed(2))
            },
            dataSources: {
                sentiment: 'Fear & Greed Index (alternative.me)',
                volatility: 'ETH Gas Price (Alchemy)',
                fomo: 'Whale Movements (Alchemy)',
                meme: 'Network Utilization (Alchemy)',
                timestamp: new Date().toISOString()
            }
        };
    } catch (error) {
        console.error('❌ Index calculation error:', error);
        return { index: 50, level: 'NEUTRAL', emoji: '😐', breakdown: { sentiment: 50, volatility: 50, fomo: 50, meme: 50 }, error: error.message };
    }
}
