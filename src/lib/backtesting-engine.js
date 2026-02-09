// Backtesting Engine - Historical Performance Analysis

// Generate historical data points
function generateHistoricalData(days = 180) {
    const data = [];
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    
    for (let i = days; i >= 0; i--) {
        const timestamp = now - (i * dayMs);
        const date = new Date(timestamp);
        
        // Simulate realistic index values
        const baseIndex = 50;
        const volatility = 20;
        const trend = Math.sin(i / 30) * 15; // Long-term cycle
        const noise = (Math.random() - 0.5) * volatility;
        
        const index = Math.max(0, Math.min(100, baseIndex + trend + noise));
        
        // Simulate BTC price (simplified correlation)
        const btcBase = 45000;
        const btcVolatility = 5000;
        const btcPrice = btcBase + (index - 50) * 500 + (Math.random() - 0.5) * btcVolatility;
        
        data.push({
            date: date.toISOString().split('T')[0],
            timestamp,
            index: parseFloat(index.toFixed(2)),
            btcPrice: parseFloat(btcPrice.toFixed(2)),
            level: getLevel(index)
        });
    }
    
    return data;
}

function getLevel(index) {
    if (index >= 80) return 'EXTREME GREED';
    if (index >= 60) return 'GREED';
    if (index >= 40) return 'NEUTRAL';
    if (index >= 20) return 'FEAR';
    return 'EXTREME FEAR';
}

// Calculate buy/sell signals
export function calculateSignals(historicalData, strategy = 'contrarian') {
    const signals = [];
    
    historicalData.forEach((point, idx) => {
        if (idx === 0) return;
        
        const prev = historicalData[idx - 1];
        
        if (strategy === 'contrarian') {
            // Buy on extreme fear, sell on extreme greed
            if (point.index < 20 && prev.index >= 20) {
                signals.push({
                    date: point.date,
                    type: 'BUY',
                    index: point.index,
                    btcPrice: point.btcPrice,
                    reason: 'Extreme Fear - Potential Bottom'
                });
            }
            else if (point.index > 80 && prev.index <= 80) {
                signals.push({
                    date: point.date,
                    type: 'SELL',
                    index: point.index,
                    btcPrice: point.btcPrice,
                    reason: 'Extreme Greed - Potential Top'
                });
            }
        }
        else if (strategy === 'momentum') {
            // Buy when crossing above 50, sell when crossing below
            if (point.index > 50 && prev.index <= 50) {
                signals.push({
                    date: point.date,
                    type: 'BUY',
                    index: point.index,
                    btcPrice: point.btcPrice,
                    reason: 'Momentum Shift Bullish'
                });
            }
            else if (point.index < 50 && prev.index >= 50) {
                signals.push({
                    date: point.date,
                    type: 'SELL',
                    index: point.index,
                    btcPrice: point.btcPrice,
                    reason: 'Momentum Shift Bearish'
                });
            }
        }
    });
    
    return signals;
}

// Calculate performance metrics
export function calculatePerformance(signals, historicalData) {
    if (signals.length === 0) {
        return {
            totalTrades: 0,
            winRate: 0,
            totalReturn: 0,
            maxDrawdown: 0,
            sharpeRatio: 0
        };
    }
    
    let balance = 10000; // Starting capital
    let btcHolding = 0;
    let trades = [];
    let peak = balance;
    let maxDrawdown = 0;
    
    signals.forEach(signal => {
        if (signal.type === 'BUY' && balance > 0) {
            btcHolding = balance / signal.btcPrice;
            balance = 0;
            trades.push({
                type: 'BUY',
                date: signal.date,
                price: signal.btcPrice,
                amount: btcHolding
            });
        }
        else if (signal.type === 'SELL' && btcHolding > 0) {
            balance = btcHolding * signal.btcPrice;
            btcHolding = 0;
            trades.push({
                type: 'SELL',
                date: signal.date,
                price: signal.btcPrice,
                amount: balance
            });
            
            // Update peak and drawdown
            if (balance > peak) peak = balance;
            const drawdown = ((peak - balance) / peak) * 100;
            if (drawdown > maxDrawdown) maxDrawdown = drawdown;
        }
    });
    
    // Final balance (sell remaining BTC)
    if (btcHolding > 0) {
        const lastPrice = historicalData[historicalData.length - 1].btcPrice;
        balance = btcHolding * lastPrice;
    }
    
    const totalReturn = ((balance - 10000) / 10000) * 100;
    
    // Calculate win rate
    const completedTrades = Math.floor(trades.length / 2) * 2;
    let wins = 0;
    
    for (let i = 0; i < completedTrades; i += 2) {
        const buyPrice = trades[i].price;
        const sellPrice = trades[i + 1].price;
        if (sellPrice > buyPrice) wins++;
    }
    
    const winRate = completedTrades > 0 
        ? (wins / (completedTrades / 2)) * 100 
        : 0;
    
    return {
        totalTrades: Math.floor(trades.length / 2),
        winRate: parseFloat(winRate.toFixed(2)),
        totalReturn: parseFloat(totalReturn.toFixed(2)),
        maxDrawdown: parseFloat(maxDrawdown.toFixed(2)),
        finalBalance: parseFloat(balance.toFixed(2)),
        trades: trades
    };
}

// Main backtesting function
export function runBacktest(days = 180, strategy = 'contrarian') {
    const historicalData = generateHistoricalData(days);
    const signals = calculateSignals(historicalData, strategy);
    const performance = calculatePerformance(signals, historicalData);
    
    return {
        historicalData,
        signals,
        performance,
        strategy,
        period: `${days} days`
    };
}

// Compare strategies
export function compareStrategies(days = 180) {
    const contrarian = runBacktest(days, 'contrarian');
    const momentum = runBacktest(days, 'momentum');
    
    // Buy & Hold benchmark
    const historicalData = generateHistoricalData(days);
    const startPrice = historicalData[0].btcPrice;
    const endPrice = historicalData[historicalData.length - 1].btcPrice;
    const buyHoldReturn = ((endPrice - startPrice) / startPrice) * 100;
    
    return {
        contrarian: contrarian.performance,
        momentum: momentum.performance,
        buyAndHold: {
            totalReturn: parseFloat(buyHoldReturn.toFixed(2)),
            strategy: 'Buy & Hold'
        },
        winner: contrarian.performance.totalReturn > momentum.performance.totalReturn 
            ? 'Contrarian' 
            : 'Momentum'
    };
}
