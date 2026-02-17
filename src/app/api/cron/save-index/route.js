export const dynamic = 'force-dynamic';

import { createClient } from '@supabase/supabase-js';

function getAdmin() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_KEY
    );
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');

    if (secret !== process.env.CRON_SECRET) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const supabase = getAdmin();
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pepeline.com';

        // Fetch current index
        const { GET: getIndex } = await import('@/app/api/index/route');
        const indexRes = await getIndex();
        const indexData = await indexRes.json();

        if (!indexData?.index) {
            return Response.json({ success: false, error: 'Could not fetch index' });
        }

        // Fetch BTC price from Supra
        const supraRes = await fetch(`${baseUrl}/api/supra-prices?pair=btc_usdt`);
        const supraData = await supraRes.json();
        const btcPrice = supraData?.price || null;

        // Save to Supabase
        const { error } = await supabase
            .from('index_history')
            .insert({
                index_value: indexData.index,
                level: indexData.level,
                btc_price: btcPrice,
                created_at: new Date().toISOString()
            });

        if (error) throw error;

        console.log(`✅ Saved index: ${indexData.index} (${indexData.level}) BTC: $${btcPrice}`);

        return Response.json({
            success: true,
            index: indexData.index,
            level: indexData.level,
            btc: btcPrice,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Save index error:', error);
        return Response.json({ success: false, error: error.message }, { status: 500 });
    }
}
