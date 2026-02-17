export const dynamic = 'force-dynamic';

import { createClient } from '@supabase/supabase-js';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

function getAdmin() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_KEY
    );
}

async function sendMessage(chatId, text, parseMode = 'HTML') {
    await fetch(`${TELEGRAM_API}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: parseMode, disable_web_page_preview: true })
    });
}

async function getPepelineIndex() {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pepeline.com';
        const res = await fetch(`${baseUrl}/api/index`, { cache: 'no-store' });
        return await res.json();
    } catch { return null; }
}

async function getAdvancedMetrics() {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pepeline.com';
        const res = await fetch(`${baseUrl}/api/advanced-metrics`, { cache: 'no-store' });
        return await res.json();
    } catch { return null; }
}

async function getSupraPrices() {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pepeline.com';
        const res = await fetch(`${baseUrl}/api/supra-prices`, { cache: 'no-store' });
        return await res.json();
    } catch { return null; }
}

function getIndexBar(value) {
    const filled = Math.round(value / 10);
    return '█'.repeat(filled) + '░'.repeat(10 - filled);
}

function getLevelEmoji(level) {
    const map = { 'EXTREME FEAR': '😱', 'FEAR': '😟', 'NEUTRAL': '😐', 'GREED': '🤑', 'EXTREME GREED': '🔥' };
    return map[level] || '❓';
}

function formatPrice(price) {
    if (!price) return '—';
    if (price < 1) return `$${price.toFixed(4)}`;
    if (price < 1000) return `$${price.toFixed(2)}`;
    return `$${price.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

// ─── HANDLERS ────────────────────────────────────────────────────────────────

async function handleStart(chatId) {
    await sendMessage(chatId, `🐸 <b>Welcome to Pepeline Bot!</b>

Real-time crypto sentiment powered by AI + Alchemy on-chain data.

<b>Commands:</b>
/index — Current Pepeline Index
/prices — Live crypto prices
/gas — Ethereum gas prices
/whales — Whale activity
/metrics — Full market overview
/subscribe — Extreme sentiment alerts 🔔
/alert BTC above 75000 — Set price alert
/myalerts — Your active alerts
/help — All commands

🌐 <a href="https://pepeline.com">pepeline.com</a>`);
}

async function handleIndex(chatId) {
    const data = await getPepelineIndex();
    if (!data?.index) { await sendMessage(chatId, '⚠️ Could not fetch index.'); return; }

    const bar = getIndexBar(data.index);
    const emoji = getLevelEmoji(data.level);
    const breakdown = data.breakdown || {};

    await sendMessage(chatId, `${emoji} <b>Pepeline Index</b>

<b>${data.index}/100</b> — ${data.level}
<code>[${bar}]</code>

📊 <b>Breakdown:</b>
- Fear & Greed: ${breakdown.sentiment || '—'}
- Volatility: ${breakdown.volatility || '—'}
- FOMO: ${typeof breakdown.fomo === 'number' ? breakdown.fomo.toFixed(1) : '—'}
- Meme: ${typeof breakdown.meme === 'number' ? breakdown.meme.toFixed(1) : '—'}

🕐 ${new Date().toLocaleTimeString('en-US')} UTC
🌐 <a href="https://pepeline.com">pepeline.com</a>`);
}

async function handlePrices(chatId) {
    const data = await getSupraPrices();
    if (!data?.prices) { await sendMessage(chatId, '⚠️ Could not fetch prices.'); return; }

    const lines = data.prices.map(p => {
        const arrow = p.change24h >= 0 ? '▲' : '▼';
        const sign = p.change24h >= 0 ? '+' : '';
        return `${p.symbol}: <b>${formatPrice(p.price)}</b> ${arrow} ${sign}${p.change24h.toFixed(2)}%`;
    }).join('\n');

    await sendMessage(chatId, `💰 <b>Live Crypto Prices</b>
<i>via Supra Oracle</i>

${lines}

🕐 ${new Date().toLocaleTimeString('en-US')} UTC
🌐 <a href="https://pepeline.com">pepeline.com</a>`);
}

async function handleGas(chatId) {
    const metrics = await getAdvancedMetrics();
    const gas = metrics?.onchain?.gas;
    if (!gas) { await sendMessage(chatId, '⚠️ Could not fetch gas data.'); return; }

    const emoji = gas.congestion === 'LOW' ? '🟢' : gas.congestion === 'HIGH' ? '🔴' : '🟡';
    await sendMessage(chatId, `⛽ <b>Ethereum Gas Prices</b>

${emoji} Network: <b>${gas.congestion || 'UNKNOWN'}</b>
- Safe: <b>${gas.safe || '—'} Gwei</b>
- Fast: <b>${gas.fast || '—'} Gwei</b>

🌐 <a href="https://pepeline.com">pepeline.com</a>`);
}

async function handleWhales(chatId) {
    const metrics = await getAdvancedMetrics();
    const whales = metrics?.onchain?.whales;
    if (!whales) { await sendMessage(chatId, '⚠️ Could not fetch whale data.'); return; }

    const emoji = whales.signal === 'ACCUMULATION' ? '🟢' : whales.signal === 'DISTRIBUTION' ? '🔴' : '⚪';
    await sendMessage(chatId, `🐋 <b>Whale Activity</b>

${emoji} Signal: <b>${whales.signal || 'NEUTRAL'}</b>
📦 Recent transfers: <b>${whales.recentTransfers || 0}</b>

💡 ${whales.signal === 'ACCUMULATION' ? 'Whales buying — bullish signal' : whales.signal === 'DISTRIBUTION' ? 'Whales selling — caution' : 'No clear whale direction'}

🌐 <a href="https://pepeline.com">pepeline.com</a>`);
}

async function handleMetrics(chatId) {
    const [indexData, metrics] = await Promise.all([getPepelineIndex(), getAdvancedMetrics()]);
    const fng = metrics?.macro?.fng;
    const btcDom = metrics?.macro?.btcDom;
    const mcap = metrics?.macro?.mcap;
    const signalEmoji = metrics?.signal?.includes('BUY') ? '🟢' : metrics?.signal?.includes('SELL') ? '🔴' : '🟡';

    await sendMessage(chatId, `📊 <b>Full Market Overview</b>

🐸 <b>Pepeline Index: ${indexData?.index || '—'}/100</b> (${indexData?.level || '—'})

⛓️ <b>On-Chain:</b>
- Gas: ${metrics?.onchain?.gas?.safe || '—'} Gwei (${metrics?.onchain?.gas?.congestion || '—'})
- Whales: ${metrics?.onchain?.whales?.signal || '—'}
- Network: ${metrics?.onchain?.network?.utilization || '—'}%

📈 <b>Macro:</b>
- Fear & Greed: ${fng?.value || '—'} (${fng?.classification || '—'})
- BTC Dom: ${btcDom?.percentage || '—'}%
- Market Cap: ${mcap?.formatted || '—'}

${signalEmoji} Signal: <b>${metrics?.signal || 'HOLD'}</b>
🌐 <a href="https://pepeline.com">pepeline.com</a>`);
}

async function handleSubscribe(chatId, username, firstName) {
    const supabase = getAdmin();
    try {
        await supabase.from('alert_subscribers').upsert(
            { chat_id: chatId, username: username || null, first_name: firstName || null, subscribed_at: new Date().toISOString() },
            { onConflict: 'chat_id' }
        );
        await sendMessage(chatId, `🔔 <b>Subscribed to Extreme Alerts!</b>

You'll get notified when:
- 😱 Index drops below 20 (Extreme Fear)
- 🔥 Index rises above 80 (Extreme Greed)

Max 1 alert per 6 hours.
Use /unsubscribe to stop.

🌐 <a href="https://pepeline.com">pepeline.com</a>`);
    } catch (err) {
        await sendMessage(chatId, '⚠️ Could not subscribe. Try again later.');
    }
}

async function handleUnsubscribe(chatId) {
    const supabase = getAdmin();
    try {
        await supabase.from('alert_subscribers').delete().eq('chat_id', chatId);
        await sendMessage(chatId, `🔕 <b>Unsubscribed from alerts.</b>

Use /subscribe to re-enable anytime.
🌐 <a href="https://pepeline.com">pepeline.com</a>`);
    } catch (err) {
        await sendMessage(chatId, '⚠️ Could not unsubscribe. Try again later.');
    }
}

// /alert BTC above 75000
// /alert ETH below 2000
async function handleSetAlert(chatId, text) {
    const parts = text.trim().split(/\s+/);
    // parts: ['/alert', 'BTC', 'above', '75000']

    if (parts.length < 4) {
        await sendMessage(chatId, `❌ <b>Invalid format.</b>

Usage: <code>/alert SYMBOL above/below PRICE</code>

Examples:
- <code>/alert BTC above 75000</code>
- <code>/alert ETH below 2000</code>
- <code>/alert SOL above 100</code>

Supported: BTC, ETH, SOL, BNB, XRP, DOGE, ADA, AVAX, LINK`);
        return;
    }

    const symbol = parts[1].toUpperCase();
    const condition = parts[2].toLowerCase();
    const targetPrice = parseFloat(parts[3]);

    const validSymbols = ['BTC', 'ETH', 'SOL', 'BNB', 'XRP', 'DOGE', 'ADA', 'AVAX', 'LINK'];
    if (!validSymbols.includes(symbol)) {
        await sendMessage(chatId, `❌ Symbol <b>${symbol}</b> not supported.\n\nSupported: ${validSymbols.join(', ')}`);
        return;
    }
    if (!['above', 'below'].includes(condition)) {
        await sendMessage(chatId, `❌ Condition must be <b>above</b> or <b>below</b>.`);
        return;
    }
    if (isNaN(targetPrice) || targetPrice <= 0) {
        await sendMessage(chatId, `❌ Invalid price: <b>${parts[3]}</b>`);
        return;
    }

    const supabase = getAdmin();
    try {
        // Max 5 alerts per user
        const { data: existing } = await supabase
            .from('price_alerts')
            .select('id')
            .eq('chat_id', chatId)
            .eq('triggered', false);

        if (existing && existing.length >= 5) {
            await sendMessage(chatId, `⚠️ You have reached the maximum of <b>5 active alerts</b>.\n\nUse /myalerts to manage or delete existing ones.`);
            return;
        }

        await supabase.from('price_alerts').insert({
            chat_id: chatId,
            symbol,
            condition,
            target_price: targetPrice,
            triggered: false,
            created_at: new Date().toISOString()
        });

        await sendMessage(chatId, `✅ <b>Price Alert Set!</b>

🪙 <b>${symbol}</b> ${condition === 'above' ? '📈' : '📉'} <b>${formatPrice(targetPrice)}</b>

You'll be notified when ${symbol} goes ${condition} ${formatPrice(targetPrice)}.

Use /myalerts to see all your alerts.`);
    } catch (err) {
        console.error('Set alert error:', err);
        await sendMessage(chatId, '⚠️ Could not set alert. Try again later.');
    }
}

async function handleMyAlerts(chatId) {
    const supabase = getAdmin();
    try {
        const { data: alerts } = await supabase
            .from('price_alerts')
            .select('*')
            .eq('chat_id', chatId)
            .eq('triggered', false)
            .order('created_at', { ascending: false });

        if (!alerts || alerts.length === 0) {
            await sendMessage(chatId, `📋 <b>No Active Alerts</b>

Set one with:
<code>/alert BTC above 75000</code>`);
            return;
        }

        const lines = alerts.map((a, i) =>
            `${i + 1}. ${a.symbol} ${a.condition === 'above' ? '📈' : '📉'} ${formatPrice(a.target_price)} — <code>/deletealert ${a.id.slice(0, 8)}</code>`
        ).join('\n');

        await sendMessage(chatId, `📋 <b>Your Active Alerts (${alerts.length}/5)</b>

${lines}

To delete: <code>/deletealert [ID]</code>`);
    } catch (err) {
        await sendMessage(chatId, '⚠️ Could not fetch alerts.');
    }
}

async function handleDeleteAlert(chatId, text) {
    const parts = text.trim().split(/\s+/);
    if (parts.length < 2) {
        await sendMessage(chatId, `Usage: <code>/deletealert [ID]</code>\n\nGet IDs from /myalerts`);
        return;
    }

    const shortId = parts[1];
    const supabase = getAdmin();

    try {
        const { data: alerts } = await supabase
            .from('price_alerts')
            .select('id, symbol, condition, target_price')
            .eq('chat_id', chatId)
            .eq('triggered', false);

        const match = alerts?.find(a => a.id.startsWith(shortId));
        if (!match) {
            await sendMessage(chatId, `❌ Alert <code>${shortId}</code> not found.\n\nUse /myalerts to see your alerts.`);
            return;
        }

        await supabase.from('price_alerts').delete().eq('id', match.id);
        await sendMessage(chatId, `🗑️ Alert deleted: <b>${match.symbol} ${match.condition} ${formatPrice(match.target_price)}</b>`);
    } catch (err) {
        await sendMessage(chatId, '⚠️ Could not delete alert.');
    }
}

async function handleHelp(chatId) {
    await sendMessage(chatId, `🐸 <b>Pepeline Bot Commands</b>

<b>Market Data:</b>
/index — Sentiment index (0-100)
/prices — Live crypto prices
/gas — Ethereum gas prices
/whales — Whale wallet activity
/metrics — Full market overview

<b>Alerts:</b>
/subscribe — Extreme sentiment alerts 🔔
/unsubscribe — Stop sentiment alerts
/alert BTC above 75000 — Set price alert
/myalerts — View active alerts
/deletealert [ID] — Delete an alert

<b>Links:</b>
- <a href="https://pepeline.com">Website</a>
- <a href="https://pepeline.com/whitelist">$SENT Whitelist</a>
- <a href="https://pepeline.com/backtest">Backtest</a>
- <a href="https://pepeline.com/dashboard">Dashboard</a>`);
}

// ─── MAIN POST ────────────────────────────────────────────────────────────────

export async function POST(request) {
    try {
        const body = await request.json();
        const message = body?.message;
        if (!message) return Response.json({ ok: true });

        const chatId = message.chat?.id;
        const text = message.text?.trim() || '';
        const command = text.split(' ')[0].toLowerCase();
        const username = message.from?.username;
        const firstName = message.from?.first_name;

        if (!chatId) return Response.json({ ok: true });

        switch (command) {
            case '/start':       await handleStart(chatId); break;
            case '/index':       await handleIndex(chatId); break;
            case '/prices':      await handlePrices(chatId); break;
            case '/gas':         await handleGas(chatId); break;
            case '/whales':      await handleWhales(chatId); break;
            case '/metrics':     await handleMetrics(chatId); break;
            case '/subscribe':   await handleSubscribe(chatId, username, firstName); break;
            case '/unsubscribe': await handleUnsubscribe(chatId); break;
            case '/alert':       await handleSetAlert(chatId, text); break;
            case '/myalerts':    await handleMyAlerts(chatId); break;
            case '/deletealert': await handleDeleteAlert(chatId, text); break;
            case '/help':        await handleHelp(chatId); break;
            default:             await sendMessage(chatId, '❓ Unknown command. Use /help to see all commands.');
        }

        return Response.json({ ok: true });
    } catch (error) {
        console.error('Telegram webhook error:', error);
        return Response.json({ ok: true });
    }
}

export async function GET() {
    return Response.json({
        status: 'Telegram webhook active',
        bot: '@Pepelinebot',
        commands: ['/start', '/index', '/prices', '/gas', '/whales', '/metrics', '/subscribe', '/unsubscribe', '/alert', '/myalerts', '/deletealert', '/help']
    });
}
