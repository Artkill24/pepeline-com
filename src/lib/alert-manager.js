// Simple in-memory alert subscriptions
// TODO: Move to database for production

const subscriptions = new Map();

export function subscribe(userId, alertType, threshold = null) {
    if (!subscriptions.has(userId)) {
        subscriptions.set(userId, []);
    }
    
    const userAlerts = subscriptions.get(userId);
    
    // Avoid duplicates
    if (!userAlerts.some(a => a.type === alertType)) {
        userAlerts.push({
            type: alertType,
            threshold,
            createdAt: Date.now()
        });
        
        console.log(`✅ User ${userId} subscribed to ${alertType}`);
        return true;
    }
    
    return false;
}

export function unsubscribe(userId, alertType) {
    if (!subscriptions.has(userId)) return false;
    
    const userAlerts = subscriptions.get(userId);
    const filtered = userAlerts.filter(a => a.type !== alertType);
    
    if (filtered.length < userAlerts.length) {
        subscriptions.set(userId, filtered);
        console.log(`✅ User ${userId} unsubscribed from ${alertType}`);
        return true;
    }
    
    return false;
}

export function getSubscriptions(userId) {
    return subscriptions.get(userId) || [];
}

export function getAllSubscribers(alertType) {
    const subscribers = [];
    
    for (const [userId, alerts] of subscriptions.entries()) {
        if (alerts.some(a => a.type === alertType)) {
            subscribers.push(userId);
        }
    }
    
    return subscribers;
}

// Alert types
export const ALERT_TYPES = {
    INDEX_HIGH: 'index_high',      // Index > 80
    INDEX_LOW: 'index_low',         // Index < 20
    WHALE_MOVEMENT: 'whale',        // Large whale transfers
    MEME_SPIKE: 'meme',            // Meme intensity spike
    PRICE_CHANGE: 'price',         // Major price movement
    CUSTOM: 'custom'               // User-defined threshold
};
