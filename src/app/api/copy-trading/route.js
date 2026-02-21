export const dynamic = 'force-dynamic';
import { getTopSmartWallets } from '@/lib/smart-wallets';
import { createClient } from '@supabase/supabase-js';

function getAdmin() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_KEY
    );
}

// Track copy-trading subscriptions
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'demo';

    try {
        const supabase = getAdmin();
        
        // Get user's followed wallets
        const { data: subs, error } = await supabase
            .from('copy_trading_subs')
            .select('*')
            .eq('user_id', userId)
            .eq('active', true);

        if (error) throw error;

        // Get smart wallets info
        const smartWallets = getTopSmartWallets();
        
        const subscriptions = (subs || []).map(sub => {
            const wallet = smartWallets.find(w => w.address === sub.wallet_address);
            return {
                ...sub,
                walletInfo: wallet
            };
        });

        return Response.json({
            subscriptions,
            total: subscriptions.length,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { action, userId = 'demo', walletAddress, allocation = 10 } = body;

        const supabase = getAdmin();

        if (action === 'follow') {
            const { data, error } = await supabase
                .from('copy_trading_subs')
                .insert({
                    user_id: userId,
                    wallet_address: walletAddress,
                    allocation_pct: allocation,
                    active: true
                })
                .select();

            if (error) throw error;
            return Response.json({ success: true, subscription: data[0] });
        }

        if (action === 'unfollow') {
            const { error } = await supabase
                .from('copy_trading_subs')
                .update({ active: false })
                .eq('user_id', userId)
                .eq('wallet_address', walletAddress);

            if (error) throw error;
            return Response.json({ success: true });
        }

        return Response.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
