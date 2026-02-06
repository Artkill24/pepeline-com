// Simple in-memory rate limiter

const requests = new Map();

export function rateLimit(identifier, maxRequests = 100, windowMs = 60000) {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Get existing requests for this identifier
    let userRequests = requests.get(identifier) || [];
    
    // Filter out old requests
    userRequests = userRequests.filter(time => time > windowStart);
    
    // Check if limit exceeded
    if (userRequests.length >= maxRequests) {
        return {
            allowed: false,
            remaining: 0,
            resetAt: new Date(userRequests[0] + windowMs)
        };
    }
    
    // Add current request
    userRequests.push(now);
    requests.set(identifier, userRequests);
    
    return {
        allowed: true,
        remaining: maxRequests - userRequests.length,
        resetAt: new Date(now + windowMs)
    };
}

// Cleanup old entries every minute
setInterval(() => {
    const now = Date.now();
    for (const [key, times] of requests.entries()) {
        const filtered = times.filter(time => time > now - 60000);
        if (filtered.length === 0) {
            requests.delete(key);
        } else {
            requests.set(key, filtered);
        }
    }
}, 60000);
