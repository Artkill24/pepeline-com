import { createClient } from '@supabase/supabase-js';
import { calculatePepelineIndex } from '@/lib/pepeline-calculator';

export const dynamic = 'force-dynamic';

function getAdmin() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_KEY
    );
}

// Fetch BTC price from Alchemy Prices API
async function getBTCPrice() {
    try {
        const WBTC_ADDRESS = '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599';
        const res = await fetch(
            `https://api.g.alchemy.com/prices/v1/${process.env.ALCHEMY_API_KEY}/tokens/by-address`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    addresses: [{ network: 'eth-mainnet', address: WBTC_ADDRESS }]
                })
            }
        );
        const data = await res.json();
        return parseFloat(data.data?.[0]?.prices?.[0]?.value || 0);
    } catch {
        return 0;
    }
}

export async function POST(request) {
    // Optional: verify cron secret
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const supabase = getAdmin();

        // Calculate current index
        const indexData = await calculatePepelineIndex();
        const btcPrice = await getBTCPrice();

        // Save snapshot
        const { data, error } = await supabase
            .from('index_history')
            .insert({
                index_value: indexData.index,
                level: indexData.level,
                breakdown: indexData.breakdown,
                btc_price: btcPrice || null
            })
            .select()
            .single();

        if (error) throw error;

        console.log(`✅ Index saved: ${indexData.index} (BTC: $${btcPrice})`);

        return Response.json({
            success: true,
            snapshot: {
                index: indexData.index,
                level: indexData.level,
                btc_price: btcPrice,
                saved_at: data.created_at
            }
        });

    } catch (error) {
        console.error('Save index error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}

// GET for manual trigger or health check
export async function GET() {
    return Response.json({
        message: 'Index history saver - use POST to trigger',
        tip: 'Set up Railway cron: POST /api/save-index every hour'
    });
}
