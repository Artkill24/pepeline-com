import TelegramBot from 'node-telegram-bot-api';

let bot = null;

function getBot() {
    if (!bot && process.env.TELEGRAM_BOT_TOKEN) {
        bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });
    }
    return bot;
}

// Send alert to user
export async function sendTelegramAlert(chatId, message, options = {}) {
    try {
        const telegramBot = getBot();
        if (!telegramBot) {
            console.warn('⚠️ Telegram bot not configured');
            return false;
        }

        await telegramBot.sendMessage(chatId, message, {
            parse_mode: 'Markdown',
            disable_web_page_preview: true,
            ...options
        });

        console.log('✅ Telegram alert sent to', chatId);
        return true;

    } catch (error) {
        console.error('❌ Telegram send error:', error.message);
        return false;
    }
}

// Broadcast to multiple users
export async function broadcastAlert(userIds, message) {
    const results = await Promise.allSettled(
        userIds.map(id => sendTelegramAlert(id, message))
    );
    
    const successful = results.filter(r => r.status === 'fulfilled').length;
    console.log(`📢 Broadcast: ${successful}/${userIds.length} sent`);
    
    return successful;
}

// Alert templates
export function formatIndexAlert(index, change) {
    const emoji = index > 80 ? '🔥' : index < 20 ? '❄️' : '📊';
    const trend = change > 0 ? '📈' : change < 0 ? '📉' : '➡️';
    
    return `
${emoji} *Pepeline Alert!*

Index: *${index}* ${trend}
Change: ${change > 0 ? '+' : ''}${change.toFixed(1)}%

Level: *${index > 80 ? 'EXTREME GREED' : index < 20 ? 'EXTREME FEAR' : 'NEUTRAL'}*

${index > 80 ? '⚠️ Market may be overheated!' : ''}
${index < 20 ? '💡 Potential buying opportunity?' : ''}

🔗 Live: pepeline.com
    `.trim();
}

export function formatWhaleAlert(data) {
    return `
🐋 *Whale Alert!*

${data.transfers} large transfers detected
Volume: *$${(data.volume / 1e6).toFixed(1)}M*

Signal: *${data.signal}*

🔗 Details: pepeline.com/dashboard
    `.trim();
}

export function formatMemeAlert(coin, intensity) {
    return `
🐸 *Meme Coin Alert!*

Coin: *${coin}*
Intensity: *${intensity}/100* 🔥

Social volume spiking!

⚠️ High volatility expected
🔗 Track: pepeline.com/coins/${coin.toLowerCase()}
    `.trim();
}
