export function calculateRiskScore(coinData) {
    const { sentiment, change24h, change7d, change30d, marketCap, volume } = coinData;
    
    // Base risk da volatilità
    let riskScore = 0;
    
    // 1. Volatilità (0-30 punti)
    const volatility = Math.abs(change24h) + (Math.abs(change7d || 0) / 7) + (Math.abs(change30d || 0) / 30);
    riskScore += Math.min(volatility * 2, 30);
    
    // 2. Sentiment extremes (0-25 punti)
    if (sentiment > 80 || sentiment < 20) {
        riskScore += 25;
    } else if (sentiment > 70 || sentiment < 30) {
        riskScore += 15;
    } else if (sentiment > 60 || sentiment < 40) {
        riskScore += 8;
    }
    
    // 3. Market cap (0-20 punti) - smaller = riskier
    if (marketCap < 100000000) riskScore += 20;      // < 100M
    else if (marketCap < 1000000000) riskScore += 15; // < 1B
    else if (marketCap < 10000000000) riskScore += 10; // < 10B
    else if (marketCap < 50000000000) riskScore += 5;  // < 50B
    
    // 4. Volume/MCap ratio (0-15 punti)
    const volumeRatio = volume / marketCap;
    if (volumeRatio > 0.5) riskScore += 15;      // Very high
    else if (volumeRatio > 0.3) riskScore += 10;
    else if (volumeRatio > 0.1) riskScore += 5;
    
    // 5. Recent drops (0-10 punti)
    if (change24h < -10) riskScore += 10;
    else if (change24h < -5) riskScore += 5;
    
    // Clamp 0-100
    riskScore = Math.max(0, Math.min(100, riskScore));
    
    // Determine level
    let level, emoji, color, description;
    if (riskScore < 20) {
        level = 'Low Risk';
        emoji = '🟢';
        color = 'green';
        description = 'Stable and relatively safe for crypto standards.';
    } else if (riskScore < 40) {
        level = 'Moderate';
        emoji = '🟡';
        color = 'yellow';
        description = 'Normal crypto volatility. Manage position size.';
    } else if (riskScore < 60) {
        level = 'Elevated';
        emoji = '🟠';
        color = 'orange';
        description = 'Higher volatility. Only risk what you can lose.';
    } else if (riskScore < 80) {
        level = 'High Risk';
        emoji = '🔴';
        color = 'red';
        description = 'Extreme volatility. Small positions only.';
    } else {
        level = 'Extreme';
        emoji = '💀';
        color = 'red';
        description = 'Maximum risk. Gambling territory.';
    }
    
    return {
        score: Math.round(riskScore),
        level,
        emoji,
        color,
        description,
        factors: {
            volatility: Math.round((Math.min(volatility * 2, 30) / 30) * 100),
            sentiment: sentiment > 70 || sentiment < 30 ? 'Extreme' : sentiment > 60 || sentiment < 40 ? 'High' : 'Normal',
            marketCap: marketCap > 10000000000 ? 'Large' : marketCap > 1000000000 ? 'Medium' : 'Small',
            volume: volumeRatio > 0.3 ? 'Very High' : volumeRatio > 0.1 ? 'High' : 'Normal'
        }
    };
}

export function getRiskRecommendation(riskScore, sentiment) {
    if (riskScore < 20) {
        return "Conservative play. Good for larger allocations.";
    } else if (riskScore < 40) {
        if (sentiment < 40) return "Moderate risk at discount. DCA opportunity.";
        return "Balanced risk/reward. Standard position sizing.";
    } else if (riskScore < 60) {
        if (sentiment > 60) return "Hot asset cooling down. Wait for better entry.";
        return "Volatile but potentially rewarding. Small to medium position.";
    } else if (riskScore < 80) {
        return "High risk/reward. Only for experienced traders. Small position.";
    } else {
        return "Extreme risk. Moonshot or rug territory. Micro position only.";
    }
}
