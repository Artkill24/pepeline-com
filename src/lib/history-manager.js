// Gestisce lo storico dell'indice (in-memory per ora, poi database)

class HistoryManager {
    constructor() {
        this.history = [];
        this.maxHistory = 168; // 7 giorni * 24 ore
    }

    addEntry(indexData) {
        const entry = {
            ...indexData,
            recordedAt: new Date().toISOString()
        };

        this.history.push(entry);

        // Mantieni solo gli ultimi 7 giorni
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        }

        return entry;
    }

    getLastEntry() {
        if (this.history.length === 0) return null;
        return this.history[this.history.length - 1];
    }

    getPreviousEntry() {
        if (this.history.length < 2) return null;
        return this.history[this.history.length - 2];
    }

    getEntryFromHoursAgo(hours) {
        if (this.history.length === 0) return null;
        
        const targetTime = Date.now() - (hours * 60 * 60 * 1000);
        
        // Trova l'entry più vicina al tempo target
        let closest = this.history[0];
        let minDiff = Math.abs(new Date(closest.recordedAt) - targetTime);

        for (const entry of this.history) {
            const diff = Math.abs(new Date(entry.recordedAt) - targetTime);
            if (diff < minDiff) {
                minDiff = diff;
                closest = entry;
            }
        }

        return closest;
    }

    calculateTrend(currentIndex) {
        const previous = this.getPreviousEntry();
        if (!previous) return { change: 0, percentage: 0, direction: 'neutral' };

        const change = currentIndex - previous.index;
        const percentage = ((change / previous.index) * 100).toFixed(1);

        return {
            change: parseFloat(change.toFixed(2)),
            percentage: parseFloat(percentage),
            direction: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'
        };
    }

    getHistoricalComparison(currentIndex) {
        // Confronta con pattern storici noti
        const comparisons = [
            { range: [80, 100], period: 'May 2021', description: 'Pre-crash euphoria' },
            { range: [75, 85], period: 'November 2021', description: 'ATH season vibes' },
            { range: [60, 75], period: 'March 2024', description: 'ETF approval hype' },
            { range: [40, 60], period: 'July 2023', description: 'Steady accumulation' },
            { range: [20, 40], period: 'June 2022', description: 'Bear market blues' },
            { range: [0, 20], period: 'November 2022', description: 'FTX collapse panic' }
        ];

        for (const comp of comparisons) {
            if (currentIndex >= comp.range[0] && currentIndex <= comp.range[1]) {
                return comp;
            }
        }

        return { period: 'Unknown', description: 'Unique market conditions' };
    }

    get7DayData() {
        // Ritorna ultimi 7 giorni per chart
        return this.history.slice(-168); // Ultimi 7 giorni (24h * 7)
    }
}

// Singleton instance
let historyManager = null;

export function getHistoryManager() {
    if (!historyManager) {
        historyManager = new HistoryManager();
    }
    return historyManager;
}
