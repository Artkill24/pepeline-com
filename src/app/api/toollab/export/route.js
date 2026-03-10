import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
    // Mock historical signal data for ToolLab
    const signalHistory = [];
    const coins = ['BTC', 'ETH', 'SOL', 'AVAX', 'DOGE'];
    const baseDate = new Date('2026-03-01');
    
    // Generate 30 days of historical signals
    for (let day = 0; day < 30; day++) {
        for (let i = 0; i < 5; i++) {
            const timestamp = new Date(baseDate);
            timestamp.setDate(timestamp.getDate() + day);
            timestamp.setHours(9 + (i * 3));
            
            const coin = coins[Math.floor(Math.random() * coins.length)];
            const signal = ['BUY', 'SELL', 'HOLD'][Math.floor(Math.random() * 3)];
            const strength = Math.floor(Math.random() * 40) + 60;
            const sentiment = Math.floor(Math.random() * 100);
            const price = Math.floor(Math.random() * 100000);
            const change24h = (Math.random() * 20 - 10).toFixed(2);
            
            // Simulate outcome (73% accuracy)
            const correctPrediction = Math.random() < 0.73;
            const actualOutcome = correctPrediction ? signal : 
                (signal === 'BUY' ? 'SELL' : 'BUY');
            
            signalHistory.push({
                timestamp: timestamp.toISOString(),
                coin,
                signal,
                strength,
                confidence: strength > 80 ? 'HIGH' : strength > 60 ? 'MEDIUM' : 'LOW',
                sentiment,
                price,
                change24h: parseFloat(change24h),
                actualOutcome,
                correct: correctPrediction,
                metadata: {
                    fearGreedIndex: sentiment,
                    volatility: Math.random() * 100,
                    volume24h: Math.floor(Math.random() * 1000000000)
                }
            });
        }
    }
    
    const stats = {
        totalSignals: signalHistory.length,
        correctPredictions: signalHistory.filter(s => s.correct).length,
        accuracy: ((signalHistory.filter(s => s.correct).length / signalHistory.length) * 100).toFixed(2) + '%',
        strongSignals: signalHistory.filter(s => s.strength >= 80).length,
        dateRange: {
            start: signalHistory[0].timestamp,
            end: signalHistory[signalHistory.length - 1].timestamp
        }
    };
    
    return NextResponse.json({
        stats,
        signals: signalHistory,
        exportedAt: new Date().toISOString(),
        format: 'json',
        note: 'Historical signal data for ToolLab clustering validation'
    });
}

// CSV export
export async function POST(request) {
    const { format = 'json' } = await request.json();
    
    // Get data (call GET internally)
    const mockRequest = new Request('http://localhost/api/toollab/export');
    const response = await GET(mockRequest);
    const data = await response.json();
    
    if (format === 'csv') {
        const csvHeader = 'timestamp,coin,signal,strength,confidence,sentiment,price,change24h,actualOutcome,correct\n';
        const csvRows = data.signals.map(s => 
            `${s.timestamp},${s.coin},${s.signal},${s.strength},${s.confidence},${s.sentiment},${s.price},${s.change24h},${s.actualOutcome},${s.correct}`
        ).join('\n');
        
        return new NextResponse(csvHeader + csvRows, {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': 'attachment; filename="pepeline-signals-export.csv"'
            }
        });
    }
    
    return NextResponse.json(data);
}
