export const dynamic = 'force-dynamic';

import { createClient } from '@supabase/supabase-js';

function getAdmin() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_KEY
    );
}

async function sendTelegramAlert(chatId, message) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    try {
        const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML',
                disable_web_page_preview: false
            })
        });
        return await res.json();
    } catch (error) {
        console.error('Telegram send error:', error);
        return { ok: false, error: error.message };
    }
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    
    if (secret !== process.env.CRON_SECRET) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const supabase = getAdmin();

        // 1. Fetch current index
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pepeline.com';
        const indexRes = await fetch(`${baseUrl}/api/index`);
        const indexData = await indexRes.json();

        if (!indexData || !indexData.index) {
            return Response.json({ success: false, error: 'Could not fetch index' });
        }

        const { index, level, emoji } = indexData;

        // 2. Check if alert should be sent
        let shouldAlert = false;
        let alertType = '';
        let alertMessage = '';

        if (index <= 20) {
            shouldAlert = true;
            alertType = 'extreme_fear';
            alertMessage = `🚨 <b>EXTREME FEAR ALERT</b> 🚨\n\n${emoji} Pepeline Index: <b>${index}</b>\n\nMarket sentiment has reached extreme fear levels. This could signal a buying opportunity for contrarian traders.\n\n🔗 <a href="https://pepeline.com">View Live Index</a>`;
        } else if (index >= 80) {
            shouldAlert = true;
            alertType = 'extreme_greed';
            alertMessage = `🚨 <b>EXTREME GREED ALERT</b> 🚨\n\n${emoji} Pepeline Index: <b>${index}</b>\n\nMarket sentiment has reached extreme greed levels. Exercise caution - this often precedes corrections.\n\n🔗 <a href="https://pepeline.com">View Live Index</a>`;
        }

        if (!shouldAlert) {
            return Response.json({
                success: true,
                index,
                level,
                alert_sent: false,
                message: 'No extreme levels detected'
            });
        }

        // 3. Get subscribers
        const { data: subscribers, error: subError } = await supabase
            .from('alert_subscribers')
            .select('chat_id, last_alert_sent')
            .contains('alert_types', [alertType]);

        if (subError) {
            console.error('Supabase error:', subError);
            return Response.json({ success: false, error: subError.message });
        }

        // 4. Send alerts (throttle: max 1 per 6 hours per user)
        const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString();
        let sentCount = 0;
        
        for (const sub of subscribers || []) {
            // Skip if alert sent in last 6 hours
            if (sub.last_alert_sent && sub.last_alert_sent > sixHoursAgo) {
                continue;
            }

            const result = await sendTelegramAlert(sub.chat_id, alertMessage);
            
            if (result.ok) {
                sentCount++;
                // Update last_alert_sent
                await supabase
                    .from('alert_subscribers')
                    .update({ last_alert_sent: new Date().toISOString() })
                    .eq('chat_id', sub.chat_id);
            }
        }

        return Response.json({
            success: true,
            index,
            level,
            alert_type: alertType,
            alert_sent: true,
            subscribers_notified: sentCount,
            total_subscribers: subscribers?.length || 0
        });

    } catch (error) {
        console.error('Alert check error:', error);
        return Response.json({ success: false, error: error.message }, { status: 500 });
    }
}
