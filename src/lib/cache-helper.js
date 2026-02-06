// Simple in-memory cache with TTL

const cache = new Map();

export function getCache(key) {
    const item = cache.get(key);
    
    if (!item) return null;
    
    // Check expiration
    if (Date.now() > item.expires) {
        cache.delete(key);
        return null;
    }
    
    return item.data;
}

export function setCache(key, data, ttlSeconds = 60) {
    cache.set(key, {
        data,
        expires: Date.now() + (ttlSeconds * 1000)
    });
}

export function clearCache(pattern = null) {
    if (pattern) {
        for (const key of cache.keys()) {
            if (key.includes(pattern)) {
                cache.delete(key);
            }
        }
    } else {
        cache.clear();
    }
}

// Auto cleanup every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [key, item] of cache.entries()) {
        if (now > item.expires) {
            cache.delete(key);
        }
    }
}, 5 * 60 * 1000);
