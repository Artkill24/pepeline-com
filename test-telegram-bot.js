const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config({ path: '.env.local' });

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
    console.error('❌ TELEGRAM_BOT_TOKEN not set in .env.local');
    process.exit(1);
}

console.log('🤖 Starting Telegram bot...');
console.log('📱 Token:', token.substring(0, 10) + '...');

const bot = new TelegramBot(token, { 
    polling: {
        interval: 300,
        autoStart: true
    }
});

console.log('✅ Bot started in polling mode');

// Test connection
bot.getMe().then(me => {
    console.log('✅ Bot connected:', me.username);
}).catch(err => {
    console.error('❌ Failed to connect:', err.message);
});

// Handle /start command
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    console.log('📱 /start from', chatId);
    
    bot.sendMessage(chatId, `
🐸 *Welcome to Pepeline Alert Bot!*

Track crypto sentiment in real-time!

*Commands:*
/status - Check current index
/subscribe - Get alerts
/help - Show help

🔗 Visit: pepeline.com
    `, { 
        parse_mode: 'Markdown' 
    }).then(() => {
        console.log('✅ Welcome message sent');
    }).catch(err => {
        console.error('❌ Send error:', err.message);
    });
});

// Handle /status command
bot.onText(/\/status/, async (msg) => {
    const chatId = msg.chat.id;
    console.log('📱 /status from', chatId);
    
    try {
        const response = await fetch('http://localhost:3000/api/index');
        const index = await response.json();
        
        const emoji = index.emoji || '😐';
        const message = `
📊 *Pepeline Index*

Current: *${index.index}* ${emoji}
Level: *${index.level}*

Breakdown:
- Sentiment: ${index.breakdown.sentiment}
- Volatility: ${index.breakdown.volatility}
- FOMO: ${index.breakdown.fomo}
- Meme: ${index.breakdown.meme}

🔗 Live: pepeline.com
        `;
        
        await bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
        console.log('✅ Status sent');
        
    } catch (error) {
        console.error('❌ Status error:', error.message);
        await bot.sendMessage(chatId, '❌ Failed to fetch index. Server might be down.');
    }
});

// Handle /subscribe
bot.onText(/\/subscribe/, (msg) => {
    const chatId = msg.chat.id;
    console.log('📱 /subscribe from', chatId);
    
    bot.sendMessage(chatId, `
✅ *Subscribed to alerts!*

You'll receive notifications for:
- Index > 80 (Extreme Greed) 🤑
- Index < 20 (Extreme Fear) 😱
- Whale movements 🐋

Use /unsubscribe to stop.
    `, { parse_mode: 'Markdown' });
});

// Handle /help
bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    console.log('📱 /help from', chatId);
    
    bot.sendMessage(chatId, `
📊 *Pepeline Alert Bot*

*Available Commands:*
/start - Start the bot
/status - Current market index
/subscribe - Enable alerts
/help - This message

*What we track:*
- Real-time sentiment
- Market volatility
- FOMO levels
- Meme coin intensity

🔗 pepeline.com
    `, { parse_mode: 'Markdown' });
});

// Catch all messages
bot.on('message', (msg) => {
    console.log('📱 Message received from', msg.chat.id, ':', msg.text);
});

// Error handling
bot.on('polling_error', (error) => {
    console.error('❌ Polling error:', error.message);
});

bot.on('error', (error) => {
    console.error('❌ Bot error:', error.message);
});

console.log('');
console.log('✅ Bot is ready!');
console.log('📱 Open Telegram and send /start to @Pepelinebot');
console.log('');
console.log('Press Ctrl+C to stop');
