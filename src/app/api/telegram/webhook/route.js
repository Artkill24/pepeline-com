export const dynamic = 'force-dynamic';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function sendMessage(chatId, text, parseMode = 'HTML') {
    await fetch(`${TELEGRAM_API}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: chatId,
            text,
            parse_mode: parseMode,
            disable_web_page_preview: true
        })
    });
}

async function getPepelineIndex() {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pepeline.com';
        const res = await fetch(`${baseUrl}/api/index`, { cache: 'no-store' });
        return await res.json();
    } catch {
        return null;
    }
}

async function getAdvancedMetrics() {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pepeline.com';
        const res = await fetch(`${baseUrl}/api/advanced-metrics`, { cache: 'no-store' });
        return await res.json();
    } catch {
        return null;
    }
}

function getIndexBar(value) {
    const filled = Math.round(value / 10);
    return '█'.repeat(filled) + '░'.repeat(10 - filled);
}

function getLevelEmoji(level) {
    const map = {
        'EXTREME FEAR': '😱',
        'FEAR': '😟',
        'NEUTRAL': '😐',
        'GREED': '🤑',
        'EXTREME GREED': '🔥'
    };
    return map[level] || '❓';
}

async function handleStart(chatId) {
    const text = `🐸 <b>Welcome to Pepeline Bot!</b>

I track real-time crypto market sentiment powered by AI + Alchemy on-chain data.

<b>Commands:</b>
/index — Current Pepeline Index
/gas — Ethereum gas prices  
/whales — Whale activity
/metrics — Full market overview
/help — Show all commands

🌐 <a href="https://pepeline.com">pepeline.com</a>
🎯 <a href="https://pepeline.com/whitelist">Get $PIPE Whitelist</a>`;

    await sendMessage(chatId, text);
}

async function handleIndex(chatId) {
    const data = await getPepelineIndex();

    if (!data || !data.index) {
        await sendMessage(chatId, '⚠️ Could not fetch index. Try again in a moment.');
        return;
    }

    const bar = getIndexBar(data.index);
    const emoji = getLevelEmoji(data.level);
    const breakdown = data.breakdown || {};

    const text = `${emoji} <b>Pepeline Index</b>

<b>${data.index}/100</b> — ${data.level}

<code>[${bar}]</code>

📊 <b>Breakdown:</b>
• Fear & Greed: ${breakdown.sentiment || '—'}
• Volatility: ${breakdown.volatility || '—'}
• FOMO: ${typeof breakdown.fomo === 'number' ? breakdown.fomo.toFixed(1) : '—'}
• Meme: ${typeof breakdown.meme === 'number' ? breakdown.meme.toFixed(1) : '—'}

🕐 Updated: ${new Date().toLocaleTimeString('en-US')} UTC
🌐 <a href="https://pepeline.com">pepeline.com</a>`;

    await sendMessage(chatId, text);
}

async function handleGas(chatId) {
    const metrics = await getAdvancedMetrics();
    const gas = metrics?.onchain?.gas;

    if (!gas) {
        await sendMessage(chatId, '⚠️ Could not fetch gas data.');
        return;
    }

    const congestionEmoji = gas.congestion === 'LOW' ? '🟢' : gas.congestion === 'HIGH' ? '🔴' : '🟡';

    const text = `⛽ <b>Ethereum Gas Prices</b>

${congestionEmoji} Network: <b>${gas.congestion || 'UNKNOWN'}</b>

• Safe: <b>${gas.safe || '—'} Gwei</b>
• Fast: <b>${gas.fast || '—'} Gwei</b>

🌐 <a href="https://pepeline.com">pepeline.com</a>`;

    await sendMessage(chatId, text);
}

async function handleWhales(chatId) {
    const metrics = await getAdvancedMetrics();
    const whales = metrics?.onchain?.whales;

    if (!whales) {
        await sendMessage(chatId, '⚠️ Could not fetch whale data.');
        return;
    }

    const signalEmoji = whales.signal === 'ACCUMULATION' ? '🟢' : whales.signal === 'DISTRIBUTION' ? '🔴' : '⚪';

    const text = `🐋 <b>Whale Activity</b>

${signalEmoji} Signal: <b>${whales.signal || 'NEUTRAL'}</b>
📦 Recent transfers: <b>${whales.recentTransfers || 0}</b>

💡 ${whales.signal === 'ACCUMULATION' ? 'Whales are buying — potential bullish signal' : whales.signal === 'DISTRIBUTION' ? 'Whales are selling — caution advised' : 'No clear direction from whale activity'}

🌐 <a href="https://pepeline.com">pepeline.com</a>`;

    await sendMessage(chatId, text);
}

async function handleMetrics(chatId) {
    const [indexData, metrics] = await Promise.all([
        getPepelineIndex(),
        getAdvancedMetrics()
    ]);

    const fng = metrics?.macro?.fng;
    const btcDom = metrics?.macro?.btcDom;
    const mcap = metrics?.macro?.mcap;
    const alphaScore = metrics?.alphaScore;
    const signal = metrics?.signal;

    const signalEmoji = signal?.includes('BUY') ? '🟢' : signal?.includes('SELL') ? '🔴' : '🟡';

    const text = `📊 <b>Full Market Overview</b>

🐸 <b>Pepeline Index: ${indexData?.index || '—'}/100</b> (${indexData?.level || '—'})

⛓️ <b>On-Chain:</b>
• Gas: ${metrics?.onchain?.gas?.safe || '—'} Gwei (${metrics?.onchain?.gas?.congestion || '—'})
• Whales: ${metrics?.onchain?.whales?.signal || '—'}
• Network: ${metrics?.onchain?.network?.utilization || '—'}%

📈 <b>Macro:</b>
• Fear & Greed: ${fng?.value || '—'} (${fng?.classification || '—'})
• BTC Dom: ${btcDom?.percentage || '—'}% — ${btcDom?.trend || '—'}
• Market Cap: ${mcap?.formatted || '—'} (${mcap?.change24h || '0'}% 24h)

🎯 <b>Alpha Score: ${alphaScore || 50}/100</b>
${signalEmoji} Signal: <b>${signal || 'HOLD'}</b>

🌐 <a href="https://pepeline.com">pepeline.com</a>`;

    await sendMessage(chatId, text);
}

async function handleHelp(chatId) {
    const text = `🐸 <b>Pepeline Bot Commands</b>

/start — Welcome message
/index — Current sentiment index (0-100)
/gas — Ethereum gas prices
/whales — Whale wallet activity
/metrics — Full market overview
/help — This message

🌐 <b>Links:</b>
• <a href="https://pepeline.com">Website</a>
• <a href="https://pepeline.com/whitelist">$PIPE Whitelist</a>
• <a href="https://pepeline.com/coins">On-Chain Coins</a>
• <a href="https://pepeline.com/dashboard">Dashboard</a>`;

    await sendMessage(chatId, text);
}

export async function POST(request) {
    try {
        const body = await request.json();
        const message = body?.message;

        if (!message) {
            return Response.json({ ok: true });
        }

        const chatId = message.chat?.id;
        const text = message.text?.trim() || '';
        const command = text.split(' ')[0].toLowerCase();

        if (!chatId) return Response.json({ ok: true });

        switch (command) {
            case '/start':
                await handleStart(chatId);
                break;
            case '/index':
                await handleIndex(chatId);
                break;
            case '/gas':
                await handleGas(chatId);
                break;
            case '/whales':
                await handleWhales(chatId);
                break;
            case '/metrics':
                await handleMetrics(chatId);
                break;
            case '/help':
                await handleHelp(chatId);
                break;
            default:
                // Unknown command - send help
                await sendMessage(chatId, '❓ Unknown command. Use /help to see all commands.');
        }

        return Response.json({ ok: true });

    } catch (error) {
        console.error('Telegram webhook error:', error);
        return Response.json({ ok: true }); // Always return 200 to Telegram
    }
}

export async function GET() {
    return Response.json({
        status: 'Telegram webhook active',
        bot: '@Pepelinebot',
        commands: ['/start', '/index', '/gas', '/whales', '/metrics', '/help']
    });
}
