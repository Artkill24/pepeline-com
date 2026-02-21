export const dynamic = 'force-dynamic';

const ALCHEMY_KEY = process.env.ALCHEMY_API_KEY;
const ALCHEMY_NFT = `https://eth-mainnet.g.alchemy.com/nft/v3/${ALCHEMY_KEY}`;

const TOP_COLLECTIONS = [
    { address: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d', name: 'Bored Ape Yacht Club' },
    { address: '0x60e4d786628fea6478f785a6d7e704777c86a7c6', name: 'Mutant Ape Yacht Club' },
    { address: '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb', name: 'CryptoPunks' },
    { address: '0x8a90cab2b38dba80c64b7734e58ee1db38b8992e', name: 'Doodles' },
    { address: '0x49cf6f5d44e70224e2e23fdcdd2c053f30ada28b', name: 'CloneX' },
    { address: '0x23581767a106ae21c074b2276d25e5c3e136a68b', name: 'Moonbirds' },
    { address: '0xed5af388653567af2f388e6224dc7c4b3241c544', name: 'Azuki' },
    { address: '0x5af0d9827e0c53e4799bb226655a1de152a425a5', name: 'Milady' }
];

async function getNFTFloorPrice(contractAddress) {
    try {
        const res = await fetch(`${ALCHEMY_NFT}/getFloorPrice?contractAddress=${contractAddress}`, {
            signal: AbortSignal.timeout(5000)
        });
        const data = await res.json();
        return data.openSea?.floorPrice || 0;
    } catch {
        return 0;
    }
}

export async function GET() {
    try {
        const floors = await Promise.all(
            TOP_COLLECTIONS.map(async col => {
                const floor = await getNFTFloorPrice(col.address);
                return {
                    ...col,
                    floorPrice: floor,
                    floorUsd: (floor * 3500).toFixed(0),
                    trending: floor > 1 ? 'BLUE_CHIP' : 'STANDARD'
                };
            })
        );

        const sorted = floors.sort((a, b) => b.floorPrice - a.floorPrice);

        return Response.json({
            collections: sorted,
            stats: {
                total: sorted.length,
                avgFloor: (sorted.reduce((sum, c) => sum + c.floorPrice, 0) / sorted.length).toFixed(2),
                topCollection: sorted[0].name,
                topFloor: sorted[0].floorPrice
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
