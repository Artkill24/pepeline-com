export const dynamic = 'force-dynamic';

const JUPITER_API = 'https://quote-api.jup.ag/v6';

async function getJupiterQuote(inputMint, outputMint, amount) {
    try {
        const res = await fetch(
            `${JUPITER_API}/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=50`,
            { signal: AbortSignal.timeout(10000) }
        );
        if (!res.ok) return null;
        return await res.json();
    } catch {
        return null;
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { signal, symbol, amount } = body;

        const USDC = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
        const SOL = 'So11111111111111111111111111111111111111112';
        const WBTC = '3NZ9JMVBmGAqocybic2c7LQCJScmgsAZ6vQqTDzcqmJh';
        const WETH = '7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs';

        const mints = { SOL, BTC: WBTC, ETH: WETH };
        const tokenMint = mints[symbol] || SOL;

        const inputMint = signal === 'BUY' ? USDC : tokenMint;
        const outputMint = signal === 'BUY' ? tokenMint : USDC;
        const amountLamports = Math.floor(amount * 1e6);

        const quote = await getJupiterQuote(inputMint, outputMint, amountLamports);
        const jupiterUrl = `https://jup.ag/swap/${inputMint}-${outputMint}?amount=${amount}`;

        return Response.json({
            success: true,
            signal,
            symbol,
            amount,
            quote: quote ? {
                inputAmount: quote.inAmount,
                outputAmount: quote.outAmount,
                priceImpact: quote.priceImpactPct
            } : null,
            jupiterUrl,
            instructions: 'Open Jupiter to complete. Your wallet, your control.',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
