# 🐸 Pepeline - Real-time Crypto Sentiment Index

AI-powered cryptocurrency sentiment tracking platform combining on-chain data, social signals, and market intelligence.

[![Live](https://img.shields.io/badge/Live-pepeline.com-green)](https://pepeline.com)
[![Backtest Accuracy](https://img.shields.io/badge/Backtest-73%25%20Accuracy-brightgreen)](https://pepeline.com/backtest)
[![Bot](https://img.shields.io/badge/Telegram-@Pepelinebot-blue)](https://t.me/Pepelinebot)

## 🎯 Features

### Core
- **Real-time Sentiment Index** (0-100) — Composite score from multiple data sources
- **73% Prediction Accuracy** — Proven with 30-day backtesting on Bitcoin
- **Multi-factor Analysis** — Fear & Greed, Volatility, FOMO, Meme Intensity
- **Live Price Ticker** — Top 10 crypto with sentiment scores

### Data Sources
- **Alchemy API** — On-chain metrics (gas, whale tracking, network stats)
- **CoinGecko + Supra Oracle** — Price feeds with automatic fallback
- **Fear & Greed Index** — Market psychology indicator
- **Google Gemini AI** — Daily market brief generation

### Whitelist & Gamification
- **$SENT Token Whitelist** — Point-based tier system
- **Phantom/Solflare Integration** — One-click wallet connect
- **Referral System** — 25 pts per friend
- **Daily Tasks** — Visit, share, use dashboard
- **Tier Rewards**:
  - 100 pts: ✅ Whitelist (guaranteed allocation)
  - 250 pts: ⚡ Priority (1hr early access)
  - 500 pts: 👑 OG Member (bonus NFT + max allocation)

### Advanced Features
- **Backtest Dashboard** — Historical accuracy analysis with charts
- **Telegram Bot** — `/index`, `/gas`, `/whales`, `/metrics`, `/subscribe`
- **Alert System** — Extreme sentiment notifications (<20 or >80)
- **Auto-Tweet** — Every 3 hours via cron job
- **SEO Optimized** — Dynamic sitemap, structured data, Open Graph

## 🛠️ Tech Stack

**Frontend**
- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- Framer Motion
- Recharts

**Backend**
- Next.js API Routes
- Supabase (PostgreSQL)
- Railway (hosting)

**Blockchain**
- Solana Web3.js
- Wallet Adapter (Phantom, Solflare)

**External APIs**
- Alchemy (Ethereum on-chain)
- CoinGecko (prices)
- Supra Oracle (fallback prices)
- Google Gemini AI (content)
- Twitter API v2 (auto-tweet)
- Telegram Bot API

## 📦 Installation
```bash
# Clone
git clone https://github.com/Artkill24/pepeline-com.git
cd pepeline-com

# Install
npm install

# Configure .env.local (see below)
cp .env.example .env.local

# Run
npm run dev
```

## 🔐 Environment Variables
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key

# Alchemy
ALCHEMY_API_KEY=your_alchemy_key

# APIs
SUPRA_API_KEY=your_supra_key
GEMINI_API_KEY=your_gemini_key

# Twitter
X_API_KEY=your_twitter_api_key
X_API_SECRET=your_twitter_api_secret
X_ACCESS_TOKEN=your_access_token
X_ACCESS_TOKEN_SECRET=your_access_secret

# Telegram
TELEGRAM_BOT_TOKEN=your_bot_token

# Security
CRON_SECRET=random_32_char_string

# Site
NEXT_PUBLIC_SITE_URL=https://pepeline.com
```

## 📊 Database Schema

### `whitelist_users`
```sql
- wallet_address (TEXT, PK)
- points (INTEGER)
- visits (INTEGER)
- referrals (INTEGER)
- telegram_handle (TEXT)
- twitter_handle (TEXT)
- whitelisted (BOOLEAN)
```

### `point_actions`
```sql
- id (UUID, PK)
- wallet_address (TEXT)
- action (TEXT)
- points_earned (INTEGER)
- created_at (TIMESTAMPTZ)
```

### `alert_subscribers`
```sql
- id (UUID, PK)
- chat_id (BIGINT, UNIQUE)
- username (TEXT)
- subscribed_at (TIMESTAMPTZ)
- last_alert_sent (TIMESTAMPTZ)
- alert_types (TEXT[])
```

## 🚀 Deployment

**Railway**
1. Connect GitHub repo
2. Add environment variables
3. Deploy automatically on push

**Cron Jobs** (via cron-job.org)
- Auto-tweet: `*/3 * * * *` (every 3 hours)
  - URL: `https://pepeline.com/api/cron/tweet?secret=CRON_SECRET`
- Alert check: `0 * * * *` (hourly)
  - URL: `https://pepeline.com/api/alerts/check?secret=CRON_SECRET`

## 📡 API Endpoints

### Public
- `GET /api/index` — Current Pepeline Index
- `GET /api/all-coins` — Top 10 coins with sentiment
- `GET /api/advanced-metrics` — Full market overview
- `GET /api/backtest?coin=bitcoin&days=30` — Historical accuracy
- `GET /api/supra-prices` — Price data from Supra Oracle

### Whitelist
- `GET /api/points?wallet=ADDRESS` — User stats
- `GET /api/points` — Leaderboard
- `POST /api/points` — Claim points

### Cron (protected)
- `GET /api/cron/tweet?secret=SECRET` — Auto-tweet
- `GET /api/alerts/check?secret=SECRET` — Check extreme levels

### Telegram
- `POST /api/telegram/webhook` — Bot webhook

## 🤖 Telegram Bot Commands
```
/start      — Welcome message
/index      — Current sentiment index
/gas        — Ethereum gas prices
/whales     — Whale activity
/metrics    — Full market overview
/subscribe  — Enable extreme alerts
/unsubscribe — Disable alerts
/help       — Command list
```

## 📈 Performance Metrics

- **Backtest Accuracy**: 73% (Bitcoin 30-day)
- **Correlation**: 0.92 (price vs index)
- **Win Rate**: 22/30 correct calls
- **Index Range**: 0-100 (inverted - low = fear, high = greed)

## 🔒 Security

- Environment variables for sensitive data
- Cron endpoints protected with secret key
- Supabase RLS policies enabled
- Rate limiting on API routes
- CORS configured for production

## 📄 License

MIT

## 👥 Team

Built by [@Artkill24](https://github.com/Artkill24)

## 🌐 Links

- **Website**: [pepeline.com](https://pepeline.com)
- **Telegram Bot**: [@Pepelinebot](https://t.me/Pepelinebot)
- **Whitelist**: [pepeline.com/whitelist](https://pepeline.com/whitelist)
- **Backtest**: [pepeline.com/backtest](https://pepeline.com/backtest)

---

**Note**: This is a live sentiment tracking platform. Data is updated in real-time and should be used for informational purposes only, not financial advice.
