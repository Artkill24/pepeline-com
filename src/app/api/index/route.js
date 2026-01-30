import { NextResponse } from 'next/server';
import PepelineIndex from '@/lib/pepeline-calculator';
import { getHistoryManager } from '@/lib/history-manager';

let cachedData = null;
let lastUpdate = null;

export async function GET() {
    try {
        const now = Date.now();
        const historyManager = getHistoryManager();

        // Cache di 1 ora
        if (cachedData && lastUpdate && (now - lastUpdate < 3600000)) {
            return NextResponse.json({
                ...cachedData,
                cached: true,
                nextUpdateIn: Math.ceil((3600000 - (now - lastUpdate)) / 1000) // secondi rimanenti
            });
        }

        // Calcola nuovo indice
        const calculator = new PepelineIndex();
        const result = await calculator.calculate();

        // Aggiungi allo storico
        historyManager.addEntry(result);

        // Calcola trend
        const trend = historyManager.calculateTrend(result.index);
        const historical = historyManager.getHistoricalComparison(result.index);

        // Aggiorna cache
        cachedData = {
            ...result,
            trend,
            historical
        };
        lastUpdate = now;

        return NextResponse.json({
            ...cachedData,
            cached: false,
            nextUpdateIn: 3600 // 1 ora in secondi
        });

    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to calculate index' },
            { status: 500 }
        );
    }
}
