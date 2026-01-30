const axios = require('axios');

class PepelineIndex {
    constructor() {
        this.weights = {
            sentiment: 0.4,
            volatility: 0.3,
            fomo: 0.2,
            meme: 0.1
        };
    }

    async calculate() {
        console.log('🐸 Calculating Pepeline Index...');
        
        const s = await this.getSentimentScore();
        const v = await this.getVolatilityScore();
        const f = await this.getFomoScore();
        const m = await this.getMemeIntensity();

        const index = (
            s * this.weights.sentiment +
            v * this.weights.volatility +
            f * this.weights.fomo +
            m * this.weights.meme
        );

        const result = {
            index: Math.round(index * 100) / 100,
            level: this.getLevel(index),
            components: {
                sentiment: Math.round(s * 100) / 100,
                volatility: Math.round(v * 100) / 100,
                fomo: Math.round(f * 100) / 100,
                meme: Math.round(m * 100) / 100
            },
            timestamp: new Date().toISOString(),
            nextUpdate: new Date(Date.now() + 3600000).toISOString()
        };

        console.log(`✅ Index calculated: ${result.index}`);
        return result;
    }

    async getSentimentScore() {
        try {
            console.log('  → Fetching sentiment...');
            const response = await axios.get(
                'https://api.alternative.me/fng/?limit=1',
                { timeout: 5000 }
            );
            const value = parseInt(response.data.data[0].value);
            console.log(`    ✓ Sentiment: ${value}`);
            return value;
        } catch (error) {
            console.log('    ✗ Sentiment failed, using fallback');
            return 50;
        }
    }

    async getVolatilityScore() {
        try {
            console.log('  → Fetching volatility...');
            const response = await axios.get(
                'https://api.coingecko.com/api/v3/simple/price',
                {
                    params: {
                        ids: 'bitcoin,ethereum',
                        vs_currencies: 'usd',
                        include_24hr_change: 'true'
                    },
                    timeout: 5000
                }
            );

            const btcChange = Math.abs(response.data.bitcoin.usd_24h_change);
            const ethChange = Math.abs(response.data.ethereum.usd_24h_change);

            const avgChange = (btcChange * 0.6) + (ethChange * 0.4);
            const score = Math.min(avgChange * 10, 100);
            console.log(`    ✓ Volatility: ${score.toFixed(2)}`);
            return score;
        } catch (error) {
            console.log('    ✗ Volatility failed, using fallback');
            return 50;
        }
    }

    async getFomoScore() {
        try {
            console.log('  → Fetching FOMO...');
            const response = await axios.get(
                'https://api.coingecko.com/api/v3/global',
                { timeout: 5000 }
            );

            const marketChange = Math.abs(
                response.data.data.market_cap_change_percentage_24h_usd
            );

            const score = Math.min(marketChange * 8, 100);
            console.log(`    ✓ FOMO: ${score.toFixed(2)}`);
            return score;
        } catch (error) {
            console.log('    ✗ FOMO failed, using fallback');
            return 50;
        }
    }

    async getMemeIntensity() {
        try {
            console.log('  → Fetching meme intensity...');
            const memeIds = 'dogecoin,shiba-inu,pepe,bonk,floki';
            const response = await axios.get(
                'https://api.coingecko.com/api/v3/simple/price',
                {
                    params: {
                        ids: memeIds,
                        vs_currencies: 'usd',
                        include_24hr_change: 'true'
                    },
                    timeout: 5000
                }
            );

            const changes = Object.values(response.data).map(
                coin => Math.abs(coin.usd_24h_change)
            );
            const avgChange = changes.reduce((a, b) => a + b) / changes.length;

            const score = Math.min(avgChange * 5, 100);
            console.log(`    ✓ Meme: ${score.toFixed(2)}`);
            return score;
        } catch (error) {
            console.log('    ✗ Meme failed, using fallback');
            return 50;
        }
    }

    getLevel(index) {
        if (index <= 20) {
            return {
                label: 'Calm',
                emoji: '🟢',
                color: 'pepeline-green',
                message: 'Too quiet... bottom signal?'
            };
        } else if (index <= 40) {
            return {
                label: 'Neutral',
                emoji: '🔵',
                color: 'pepeline-blue',
                message: 'Healthy market vibes'
            };
        } else if (index <= 60) {
            return {
                label: 'Active',
                emoji: '🟡',
                color: 'pepeline-yellow',
                message: 'Things getting spicy'
            };
        } else if (index <= 80) {
            return {
                label: 'Hyped',
                emoji: '🟠',
                color: 'pepeline-orange',
                message: 'FOMO zone - be careful'
            };
        } else {
            return {
                label: 'Peak Degen',
                emoji: '🔴',
                color: 'pepeline-red',
                message: 'Top signal? Consider selling'
            };
        }
    }
}

if (require.main === module) {
    (async () => {
        const calculator = new PepelineIndex();
        const result = await calculator.calculate();

        console.log(`\n🐸 PEPELINE INDEX: ${result.index}`);
        console.log(`${result.level.emoji} ${result.level.label}`);
        console.log(`💬 ${result.level.message}\n`);
        console.log('Components:');
        Object.entries(result.components).forEach(([key, value]) => {
            console.log(`  • ${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`);
        });
        console.log(`\n⏰ Next update: ${new Date(result.nextUpdate).toLocaleString()}`);
    })();
}

module.exports = PepelineIndex;
