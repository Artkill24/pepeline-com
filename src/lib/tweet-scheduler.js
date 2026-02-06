import cron from 'node-cron';

export function startTweetScheduler() {
    // Every 6 hours
    cron.schedule('0 */6 * * *', async () => {
        console.log('🐦 Running scheduled tweet...');
        
        try {
            const response = await fetch('http://localhost:3000/api/auto-tweet-advanced');
            const data = await response.json();
            console.log('✅ Scheduled tweet result:', data);
        } catch (error) {
            console.error('❌ Scheduled tweet failed:', error);
        }
    });
    
    console.log('⏰ Tweet scheduler started (every 6 hours)');
}
