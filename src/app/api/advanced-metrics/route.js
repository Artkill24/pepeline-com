import { getOnChainIndex } from '@/lib/onchain-analyzer';
import { getMacroIndex } from '@/lib/macro-analyzer';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export async function GET() {
    try {
        const [onchain, macro] = await Promise.all([
            getOnChainIndex(),
            getMacroIndex()
        ]);

        const alphaScore = Math.round(
            (onchain.score * 0.4) + (macro.score * 0.6)
        );

        return Response.json({
            alphaScore,
            signal: alphaScore > 65 ? 'STRONG BUY' :
                   alphaScore > 55 ? 'BUY' :
                   alphaScore > 45 ? 'HOLD' :
                   alphaScore > 35 ? 'SELL' : 'STRONG SELL',
            onchain,
            macro,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Advanced metrics error:', error);
        return Response.json({
            alphaScore: 50,
            signal: 'HOLD',
            onchain: { score: 50, signal: 'NEUTRAL', emoji: '😐' },
            macro: { score: 50, signal: 'NEUTRAL' },
            timestamp: new Date().toISOString()
        });
    }
}
