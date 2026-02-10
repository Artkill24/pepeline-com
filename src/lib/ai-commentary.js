// AI Commentary Generator

export function generateCommentary(index, components) {
    if (!components || typeof index !== 'number') {
        return {
            title: "Market Analysis",
            analysis: "Loading market data...",
            recommendation: "Please wait",
            confidence: "low"
        };
    }

    const sentiment = components.sentiment || 0;
    const volatility = components.volatility || 0;
    const fomo = components.fomo || 0;
    const meme = components.meme || 0;

    let title = "";
    let analysis = "";
    let recommendation = "";
    let confidence = "medium";

    if (index >= 80) {
        title = "🤑 EXTREME GREED";
        analysis = `Market showing extreme greed at ${index}. `;
        if (fomo > 70) analysis += "FOMO driving unsustainable levels. ";
        if (meme > 50) analysis += "Meme coins pumping - typical market top. ";
        recommendation = "SELL: Take profits. Historic corrections follow extreme greed.";
        confidence = "high";
    }
    else if (index >= 60) {
        title = "😊 GREED";
        analysis = `Bullish sentiment at ${index}. `;
        if (volatility < 30) analysis += "Low volatility suggests stable uptrend. ";
        recommendation = "HOLD: Market healthy but watch for overheating.";
    }
    else if (index >= 40) {
        title = "😐 NEUTRAL";
        analysis = `Balanced market at ${index}. `;
        recommendation = "WAIT: Look for clearer signals.";
    }
    else if (index >= 20) {
        title = "😟 FEAR";
        analysis = `Fear building at ${index}. `;
        if (volatility > 50) analysis += "High volatility signals uncertainty. ";
        recommendation = "WATCH: Fear can present opportunities.";
    }
    else {
        title = "😱 EXTREME FEAR";
        analysis = `Extreme fear at ${index}. `;
        if (sentiment < 20) analysis += "Historic buy opportunity. ";
        recommendation = "BUY: Contrarian opportunity. DCA on the way down.";
        confidence = "high";
    }

    return { title, analysis, recommendation, confidence };
}

// Generate AI insight from index data
export function generateInsight(indexData) {
    if (!indexData || !indexData.breakdown) {
        return {
            summary: "Loading market insights...",
            signals: [],
            confidence: "low"
        };
    }

    const { index, breakdown } = indexData;
    const signals = [];

    // Analyze sentiment
    if (breakdown.sentiment > 70) {
        signals.push({ type: "warning", text: "Extreme positive sentiment - potential reversal" });
    } else if (breakdown.sentiment < 30) {
        signals.push({ type: "opportunity", text: "Extreme negative sentiment - potential bottom" });
    }

    // Analyze volatility
    if (breakdown.volatility > 60) {
        signals.push({ type: "warning", text: "High volatility - increased risk" });
    } else if (breakdown.volatility < 20) {
        signals.push({ type: "info", text: "Low volatility - stable conditions" });
    }

    // Analyze FOMO
    if (breakdown.fomo > 70) {
        signals.push({ type: "warning", text: "FOMO levels extreme - bubble risk" });
    }

    // Analyze meme intensity
    if (breakdown.meme > 50) {
        signals.push({ type: "warning", text: "Meme coin mania - retail speculation high" });
    }

    // Generate summary
    let summary = "";
    if (index >= 80) {
        summary = "Market is overheated. Consider taking profits.";
    } else if (index >= 60) {
        summary = "Bullish conditions with some caution needed.";
    } else if (index >= 40) {
        summary = "Market is balanced. Wait for clear signals.";
    } else if (index >= 20) {
        summary = "Fear is building. Opportunities may emerge.";
    } else {
        summary = "Extreme fear presents contrarian buying opportunity.";
    }

    const confidence = signals.length > 2 ? "high" : "medium";

    return { summary, signals, confidence };
}

export function getConfidenceColor(confidence) {
    switch(confidence) {
        case 'high': return 'text-green-400';
        case 'medium': return 'text-yellow-400';
        case 'low': return 'text-red-400';
        default: return 'text-gray-400';
    }
}
