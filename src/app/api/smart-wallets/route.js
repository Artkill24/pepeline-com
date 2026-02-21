export const dynamic = 'force-dynamic';
import { getTopSmartWallets } from '@/lib/smart-wallets';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const network = searchParams.get('network') || 'all';
    const minWinRate = parseFloat(searchParams.get('minWinRate') || '0.7');

    try {
        const wallets = getTopSmartWallets(network, minWinRate);
        const avgWinRate = wallets.reduce((sum, w) => sum + w.winRate, 0) / wallets.length;

        return Response.json({
            wallets,
            total: wallets.length,
            avgWinRate: (avgWinRate * 100).toFixed(1),
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
