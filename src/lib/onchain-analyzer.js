// On-Chain Analyzer - Powered by Alchemy

const ALCHEMY_URL = `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;

const EXCHANGE_ADDRESSES = [
    '0x28c6c06298d514db089934071355e5743bf21d60',
    '0x21a31ee1afc51d94c2efccaa2092ad1028285549',
    '0xdfd5293d8e347dfe59e90efd55b2956a1343963d',
    '0x47ac0fb4f2d84898e4d9e7b4dab3c24507a6d503',
    '0xeb2629a2734e272bcc07bda959863f316f4bd4cf',
    '0x503828976d22510aad0201ac7ec88293211d23da',
];

export async function getGasPrices() {
    try {
        if (!process.env.ALCHEMY_API_KEY) throw new Error('No Alchemy key');

        const response = await fetch(ALCHEMY_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 1,
                method: 'eth_gasPrice',
                params: []
            }),
            next: { revalidate: 60 }
        });

        const data = await response.json();
        const gasPriceWei = parseInt(data.result, 16);
        const gasPriceGwei = Math.round(gasPriceWei / 1e9);

        return {
            safe: gasPriceGwei,
            fast: Math.round(gasPriceGwei * 1.2),
            gasScore: gasPriceGwei > 50 ? 20 : gasPriceGwei > 20 ? 50 : 80,
            congestion: gasPriceGwei > 50 ? 'HIGH' : gasPriceGwei > 20 ? 'MEDIUM' : 'LOW'
        };
    } catch (error) {
        console.error('Gas error:', error.message);
        return { safe: 0, fast: 0, gasScore: 50, congestion: 'UNKNOWN' };
    }
}

export async function getWhaleMovements() {
    try {
        if (!process.env.ALCHEMY_API_KEY) throw new Error('No Alchemy key');

        const response = await fetch(ALCHEMY_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 1,
                method: 'alchemy_getAssetTransfers',
                params: [{
                    fromBlock: 'latest',
                    toBlock: 'latest',
                    category: ['external'],
                    withMetadata: false,
                    excludeZeroValue: true,
                    maxCount: '0x14',
                    order: 'desc'
                }]
            }),
            next: { revalidate: 120 }
        });

        const data = await response.json();
        const transfers = data.result?.transfers || [];

        const whaleTransfers = transfers.filter(tx => parseFloat(tx.value || 0) > 100);

        let toExchanges = 0;
        let fromExchanges = 0;

        whaleTransfers.forEach(tx => {
            if (EXCHANGE_ADDRESSES.includes(tx.to?.toLowerCase())) toExchanges++;
            if (EXCHANGE_ADDRESSES.includes(tx.from?.toLowerCase())) fromExchanges++;
        });

        const total = toExchanges + fromExchanges || 1;
        const whaleScore = Math.round((fromExchanges / total) * 100) || 50;

        return {
            recentTransfers: whaleTransfers.length,
            totalVolume: whaleTransfers.reduce((sum, tx) => sum + parseFloat(tx.value || 0), 0),
            whaleScore,
            signal: whaleScore > 60 ? 'ACCUMULATION' : whaleScore < 40 ? 'DISTRIBUTION' : 'NEUTRAL'
        };
    } catch (error) {
        console.error('Whale error:', error.message);
        return { recentTransfers: 0, totalVolume: 0, whaleScore: 50, signal: 'UNKNOWN' };
    }
}

export async function getNetworkHealth() {
    try {
        if (!process.env.ALCHEMY_API_KEY) throw new Error('No Alchemy key');

        const response = await fetch(ALCHEMY_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 1,
                method: 'eth_getBlockByNumber',
                params: ['latest', false]
            }),
            next: { revalidate: 60 }
        });

        const data = await response.json();
        const block = data.result;
        const txCount = block?.transactions?.length || 0;
        const utilization = Math.min(100, Math.round((txCount / 200) * 100));

        return {
            blockNumber: parseInt(block?.number, 16) || 0,
            txCount,
            utilization,
            healthScore: utilization > 80 ? 30 : utilization > 50 ? 60 : 80
        };
    } catch (error) {
        console.error('Network health error:', error.message);
        return { blockNumber: 0, txCount: 0, utilization: 50, healthScore: 50 };
    }
}

export async function getOnChainIndex() {
    const [whales, gas, network] = await Promise.all([
        getWhaleMovements(),
        getGasPrices(),
        getNetworkHealth()
    ]);

    const onchainScore = Math.round(
        (whales.whaleScore * 0.4) +
        (gas.gasScore * 0.35) +
        (network.healthScore * 0.25)
    );

    return {
        score: onchainScore,
        whales,
        gas,
        network,
        signal: onchainScore > 60 ? 'BULLISH' : onchainScore < 40 ? 'BEARISH' : 'NEUTRAL',
        emoji: onchainScore > 60 ? '🐋' : onchainScore < 40 ? '🐻' : '😐'
    };
}
