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
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'HTML' })
    });
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    if (searchParams.get('secret') !== process.env.CRON_SECRET) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pepeline.com';
        const res = await fetch(`${baseUrl}/api/signals`, { signal: AbortSignal.timeout(15000) });
        
        if (!res.ok) {
            console.error('Signals API error:', res.status);
            return Response.json({ success: false, error: `API returned ${res.status}` });
        }

        const data = await res.json();
        console.log('Signals data:', JSON.stringify(data, null, 2));

        if (!data || !data.signals || !Array.isArray(data.signals)) {
            console.error('Invalid signals response:', data);
            return Response.json({ success: false, error: 'Invalid response format', data });
        }

        const strongSignals = data.signals.filter(s => s && s.strength >= 60 && s.signal !== 'HOLD');

        if (strongSignals.length === 0) {
            return Response.json({ 
                success: true, 
                strongSignals: 0, 
                checked: data.signals.length,
                message: 'No strong signals at the moment'
            });
        }

        // Get subscribers
        const supabase = getAdmin();
        const { data: subscribers } = await supabase
            .from('alert_subscribers')
            .select('chat_id, last_alert_sent');

        if (!subscribers || subscribers.length === 0) {
            return Response.json({ 
                success: true, 
                strongSignals: strongSignals.length, 
                sent: 0,
                message: 'No subscribers'
            });
        }

        const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString();
        let sentCount = 0;

        for (const signal of strongSignals) {
            for (const sub of subscribers) {
                if (sub.last_alert_sent && sub.last_alert_sent > threeHoursAgo) continue;

                const arrow = signal.signal === 'BUY' ? '🟢' : '🔴';
                const indicators = signal.indicators || {};
                
                const msg = `${arrow} <b>AI TRADING SIGNAL</b>

<b>${signal.symbol}</b> ${signal.signal}
Strength: <b>${signal.strength}/100</b> (${signal.confidence})
Allocation: <b>${signal.allocation}%</b>

📊 <b>Indicators:</b>
- RSI: ${indicators.rsi || '—'} (${indicators.trend || '—'})
- Volume: ${indicators.volumeRatio || '—'}x
- Position: ${indicators.pricePosition || '—'}% of range

💰 <b>Price:</b> $${signal.price ? signal.price.toLocaleString() : '—'}
📈 <b>Take Profit:</b> +${signal.takeProfit || '—'}%
🛑 <b>Stop Loss:</b> ${signal.stopLoss || '—'}%

🧠 <b>Reasoning:</b>
${(signal.reasoning || []).slice(0, 3).map(r => `• ${r}`).join('\n')}

⚠️ NOT financial advice.
🌐 <a href="https://pepeline.com/trading">View Dashboard</a>`;

                await sendTelegramAlert(sub.chat_id, msg);
                sentCount++;

                await supabase
                    .from('alert_subscribers')
                    .update({ last_alert_sent: new Date().toISOString() })
                    .eq('chat_id', sub.chat_id);
            }
        }

        return Response.json({
            success: true,
            strongSignals: strongSignals.length,
            sent: sentCount,
            signals: strongSignals.map(s => ({ 
                symbol: s.symbol, 
                signal: s.signal, 
                strength: s.strength 
            }))
        });

    } catch (error) {
        console.error('Check signals error:', error);
        return Response.json({ 
            success: false, 
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
