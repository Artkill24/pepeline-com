# 🚀 Pepeline Deployment Checklist

## Required Environment Variables
```bash
# Vercel Environment Variables
GEMINI_API_KEY=xxx
CMC_API_KEY=xxx
X_API_KEY=xxx
X_API_SECRET=xxx
X_ACCESS_TOKEN=xxx
X_ACCESS_TOKEN_SECRET=xxx
ETHERSCAN_API_KEY=xxx  # Optional - for gas data
```

## Pre-Deploy Steps

1. ✅ Test all endpoints locally
2. ✅ Verify Twitter posting works
3. ✅ Check analytics tracking
4. ✅ Test cron jobs locally
5. ✅ Review content templates
6. ✅ Set up domain (pepeline.com)

## Deploy Commands
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Add environment variables
vercel env add GEMINI_API_KEY
vercel env add CMC_API_KEY
# ... add all vars

# Redeploy with env vars
vercel --prod
```

## Post-Deploy Verification

1. ✅ Check https://pepeline.com loads
2. ✅ Test /api/index
3. ✅ Test /api/advanced-metrics
4. ✅ Verify cron jobs run (check Vercel logs)
5. ✅ Monitor Twitter account for auto-tweets
6. ✅ Check /dashboard for analytics

## Monitoring

- Vercel Dashboard: https://vercel.com/dashboard
- X Analytics: https://analytics.x.com
- Server Logs: `vercel logs`

## Growth Strategy

Week 1: Post 3x/day, monitor engagement
Week 2: Optimize posting times based on analytics
Week 3: Enable whale alerts + extreme sentiment triggers
Week 4: Start thread series, engage with community

Goal: 1000 followers in 30 days
