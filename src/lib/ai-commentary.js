// AI-style commentary generator basato su regole intelligenti

export function generateCommentary(indexData) {
    const { index, level, components } = indexData;
    
    // Analizza i pattern
    const sentiment = components.sentiment;
    const volatility = components.volatility;
    const fomo = components.fomo;
    const meme = components.meme;
    
    // Determina il "mood" del mercato
    const isExtreme = index > 80 || index < 20;
    const isVolatile = volatility > 60;
    const isFOMO = fomo > 60;
    const isDegen = meme > 60;
    
    // Seleziona commentary in base ai pattern
    let commentary = '';
    
    // Peak Degen Zone (80-100)
    if (index > 80) {
        const options = [
            "Everyone's a genius right now. Your Uber driver is probably giving crypto tips. This is when smart money takes profits. 🚩",
            "Peak euphoria detected. The 'I told you so' tweets are warming up in drafts. History suggests caution here. 💎",
            "When retail is this confident, institutions are usually selling. But hey, this time might be different... right? 🤡",
            "Maximum greed unlocked. Even the skeptics are FOMOing in. Textbook top signal, but timing is everything. ⚠️",
            "Your portfolio is up, your ego is up, risk management is... where? Classic late-cycle vibes. 🎢"
        ];
        commentary = options[Math.floor(Math.random() * options.length)];
    }
    
    // Hyped Zone (60-80)
    else if (index > 60) {
        const options = [
            "Things are heating up. Twitter timeline full of rocket emojis. Not quite euphoria, but getting there. 🚀",
            "FOMO levels rising. This is where most people finally decide to buy... usually near local tops. 📈",
            "Market getting spicy. Good time to take some profits if you're up. Or double down if you're feeling lucky. 🎲",
            "Excitement in the air. Everyone's checking prices. Pro tip: this is when mistakes happen. Stay sharp. ⚡",
            "Hype building. Discord servers buzzing. Just remember: when everyone's buying, who's selling? 🤔"
        ];
        commentary = options[Math.floor(Math.random() * options.length)];
    }
    
    // Active Zone (40-60)
    else if (index > 40) {
        const options = [
            "Healthy market activity. Not too hot, not too cold. This is actually when good trades happen. 📊",
            "Goldilocks zone. Some fear, some greed, normal volatility. Boring is beautiful in crypto. ✨",
            "Balanced vibes. Market doing market things. No extreme emotions = better decisions usually. 🧘",
            "Normal mode activated. Good time to accumulate positions without the noise. Build in silence. 🔨",
            "Steady state. The calm between the storms. Smart money works in the shadows during these times. 🌙"
        ];
        commentary = options[Math.floor(Math.random() * options.length)];
    }
    
    // Neutral/Calm Zone (20-40)
    else if (index > 20) {
        const options = [
            "Quiet... too quiet. Either accumulation or apathy. Historically, this is where opportunities hide. 👀",
            "Low energy markets. Retail left, degens sleeping. OGs know this is when you build positions. 🏗️",
            "Crickets on Crypto Twitter. Trading volumes low. This is either the bottom or close to it. 🦗",
            "Market depression setting in. Everyone's 'done with crypto' again. Smart money: 'Finally, some peace.' 😌",
            "Fear dominating. Capitulation might be near. Remember: best entries happen when nobody cares. 💰"
        ];
        commentary = options[Math.floor(Math.random() * options.length)];
    }
    
    // Extreme Calm/Bottom (0-20)
    else {
        const options = [
            "Maximum despair. Even the memes stopped. This is where generational wealth gets built... or lost. Choose wisely. 🏴‍☠️",
            "Dead silent. Last bull market's heroes are gone. Only the true believers remain. Accumulation season? 🌱",
            "Nuclear winter vibes. Everyone quit. Your normie friends think crypto died. History says: pay attention. 🧊",
            "Bottom indicators flashing. When nobody wants it, that's when you should want it. Not financial advice though. 🎯",
            "Peak pessimism. The opposite of euphoria. Markets are irrational longer than you can stay solvent. But still... 👁️"
        ];
        commentary = options[Math.floor(Math.random() * options.length)];
    }
    
    // Aggiungi note speciali per pattern specifici
    if (isVolatile && !isExtreme) {
        commentary += " High volatility without extreme sentiment = potential opportunity.";
    }
    
    if (isDegen && index < 50) {
        commentary += " Meme coins pumping in a down market? Interesting divergence. 🤨";
    }
    
    return commentary;
}

// Genera un insight aggiuntivo basato sui componenti
export function generateInsight(indexData) {
    const { components } = indexData;
    const { sentiment, volatility, fomo, meme } = components;
    
    // Trova il componente dominante
    const max = Math.max(sentiment, volatility, fomo, meme);
    
    if (max === volatility && volatility > 60) {
        return "⚡ Volatility is the main driver right now. Expect sharp moves.";
    }
    if (max === fomo && fomo > 60) {
        return "🚀 FOMO levels high. Retail might be rushing in.";
    }
    if (max === meme && meme > 50) {
        return "🎪 Meme coin season? Degen activity detected.";
    }
    if (sentiment < 30 && volatility < 40) {
        return "😴 Low conviction, low action. Accumulation phase?";
    }
    
    return "📊 All metrics balanced. Market in equilibrium.";
}
