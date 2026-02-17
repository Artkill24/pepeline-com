export const dynamic = 'force-dynamic';

import { createClient } from '@supabase/supabase-js';

function getAdmin() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_KEY
    );
}

async function sendTelegramMessage(chatId, text) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true })
    });
}

function formatPrice(price) {
    if (!price) return '—';
    if (price < 1) return `$${price.toFixed(4)}`;
    if (price < 1000) return `$${price.toFixed(2)}`;
    return `$${price.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    if (searchParams.get('secret') !== process.env.CRON_SECRET) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const supabase = getAdmin();
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pepeline.com';

        // 1. Fetch current prices from Supra
        const supraRes = await fetch(`${baseUrl}/api/supra-prices`);
        const supraData = await supraRes.json();

        if (!supraData?.prices) {
            return Response.json({ success: false, error: 'Could not fetch prices' });
        }

        // Build price map
        const priceMap = {};
        supraData.prices.forEach(p => { priceMap[p.symbol] = p.price; });

        // 2. Fetch all untriggered alerts
        const { data: alerts, error } = await supabase
            .from('price_alerts')
            .select('*')
            .eq('triggered', false);

        if (error) throw error;
        if (!alerts || alerts.length === 0) {
            return Response.json({ success: true, checked: 0, triggered: 0 });
        }

        let triggeredCount = 0;

        // 3. Check each alert
        for (const alert of alerts) {
            const currentPrice = priceMap[alert.symbol];
            if (!currentPrice) continue;

            const shouldTrigger =
                (alert.condition === 'above' && currentPrice >= alert.target_price) ||
                (alert.condition === 'below' && currentPrice <= alert.target_price);

            if (shouldTrigger) {
                const arrow = alert.condition === 'above' ? '📈' : '📉';
                const msg = `🚨 <b>Price Alert Triggered!</b>

${arrow} <b>${alert.symbol}</b> is now ${alert.condition} ${formatPrice(alert.target_price)}

Current price: <b>${formatPrice(currentPrice)}</b>
Target: <b>${formatPrice(alert.target_price)}</b>

🌐 <a href="https://pepeline.com">View on Pepeline</a>`;

                await sendTelegramMessage(alert.chat_id, msg);

                // Mark as triggered
                await supabase
                    .from('price_alerts')
                    .update({ triggered: true, triggered_at: new Date().toISOString() })
                    .eq('id', alert.id);

                triggeredCount++;
            }
        }

        return Response.json({
            success: true,
            checked: alerts.length,
            triggered: triggeredCount,
            prices: priceMap,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Check alerts error:', error);
        return Response.json({ success: false, error: error.message }, { status: 500 });
    }
}
