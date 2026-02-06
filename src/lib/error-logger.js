// Centralized error logging

export function logError(error, context = {}) {
    const errorData = {
        message: error.message,
        stack: error.stack,
        context,
        timestamp: new Date().toISOString(),
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server'
    };
    
    console.error('🔴 Error logged:', errorData);
    
    // TODO: Send to error tracking service (Sentry, LogRocket, etc)
    // if (process.env.SENTRY_DSN) {
    //     Sentry.captureException(error, { extra: context });
    // }
    
    return errorData;
}

export function logWarning(message, data = {}) {
    console.warn('⚠️ Warning:', message, data);
}

export function logInfo(message, data = {}) {
    if (process.env.NODE_ENV === 'development') {
        console.log('ℹ️ Info:', message, data);
    }
}
