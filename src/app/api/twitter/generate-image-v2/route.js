import { NextResponse } from 'next/server';
import { createCanvas } from 'canvas';

export async function POST(request) {
    const { trade } = await request.json();
    
    try {
        const width = 1200;
        const height = 675;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');
        
        // ==========================================
        // BACKGROUND - Animated Gradient Style
        // ==========================================
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#0f0c29');
        gradient.addColorStop(0.5, '#302b63');
        gradient.addColorStop(1, '#24243e');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Grid pattern
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.05)';
        ctx.lineWidth = 1;
        for (let i = 0; i < width; i += 40) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, height);
            ctx.stroke();
        }
        for (let i = 0; i < height; i += 40) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(width, i);
            ctx.stroke();
        }
        
        // ==========================================
        // TOP BAR - Status
        // ==========================================
        const actionColor = trade.action === 'BUY' ? '#10b981' : '#ef4444';
        const actionGlow = trade.action === 'BUY' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)';
        
        // Glow effect
        ctx.shadowColor = actionGlow;
        ctx.shadowBlur = 20;
        
        // Status bar
        ctx.fillStyle = actionColor;
        ctx.fillRect(0, 0, width, 10);
        
        ctx.shadowBlur = 0;
        
        // ==========================================
        // MAIN CONTENT AREA
        // ==========================================
        
        // Left panel - Coin info
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.fillRect(40, 40, 500, 595);
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.3)';
        ctx.lineWidth = 2;
        ctx.strokeRect(40, 40, 500, 595);
        
        // Action badge
        ctx.fillStyle = actionColor;
        ctx.font = 'bold 40px Arial';
        ctx.fillText(`${trade.action} SIGNAL`, 70, 100);
        
        // Coin emoji/icon
        const coinEmoji = getCoinEmoji(trade.coin);
        ctx.font = '100px Arial';
        ctx.fillText(coinEmoji, 70, 210);
        
        // Coin name
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 80px Arial';
        ctx.fillText(trade.coin, 200, 210);
        
        // Price - Big
        ctx.fillStyle = '#e5e7eb';
        ctx.font = 'bold 55px Arial';
        ctx.fillText(`$${trade.price.toLocaleString()}`, 70, 290);
        
        // Divider line
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(70, 320);
        ctx.lineTo(500, 320);
        ctx.stroke();
        
        // Metrics
        const metrics = [
            { icon: '💰', label: 'Position Size', value: `$${trade.size}` },
            { icon: '⚡', label: 'Strength', value: `${trade.strength}/100` },
            { icon: '📊', label: 'P&L', value: trade.pnl_percent ? `${trade.pnl_percent >= 0 ? '+' : ''}${trade.pnl_percent.toFixed(2)}%` : 'Pending' }
        ];
        
        let y = 370;
        metrics.forEach(m => {
            // Icon
            ctx.font = '35px Arial';
            ctx.fillText(m.icon, 70, y);
            
            // Label
            ctx.fillStyle = '#9ca3af';
            ctx.font = '25px Arial';
            ctx.fillText(m.label, 120, y);
            
            // Value
            ctx.fillStyle = m.label === 'P&L' && trade.pnl_percent 
                ? (trade.pnl_percent >= 0 ? '#10b981' : '#ef4444')
                : '#ffffff';
            ctx.font = 'bold 35px Arial';
            ctx.fillText(m.value, 120, y + 35);
            
            y += 100;
        });
        
        // ==========================================
        // RIGHT PANEL - AI Reasoning
        // ==========================================
        
        ctx.fillStyle = 'rgba(139, 92, 246, 0.1)';
        ctx.fillRect(580, 40, 580, 595);
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.5)';
        ctx.lineWidth = 3;
        ctx.strokeRect(580, 40, 580, 595);
        
        // AI Badge
        ctx.fillStyle = '#8b5cf6';
        ctx.fillRect(610, 70, 200, 50);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 28px Arial';
        ctx.fillText('🧠 AI ANALYSIS', 625, 105);
        
        // Reasoning text
        ctx.fillStyle = '#e5e7eb';
        ctx.font = '26px Arial';
        const reasoning = trade.llm_reasoning || 'Automated trade execution based on signal strength and market conditions.';
        wrapText(ctx, reasoning, 610, 160, 520, 35);
        
        // Confidence bar
        ctx.fillStyle = '#4b5563';
        ctx.fillRect(610, 520, 520, 30);
        
        const confidenceWidth = (trade.strength / 100) * 520;
        const confGradient = ctx.createLinearGradient(610, 0, 610 + confidenceWidth, 0);
        confGradient.addColorStop(0, '#10b981');
        confGradient.addColorStop(1, '#3b82f6');
        ctx.fillStyle = confGradient;
        ctx.fillRect(610, 520, confidenceWidth, 30);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px Arial';
        ctx.fillText(`Confidence: ${trade.strength}%`, 850, 540);
        
        // Timestamp
        ctx.fillStyle = '#6b7280';
        ctx.font = '22px Arial';
        const timestamp = new Date().toLocaleString('en-US', { 
            dateStyle: 'medium', 
            timeStyle: 'short' 
        });
        ctx.fillText(`📅 ${timestamp}`, 610, 590);
        
        // ==========================================
        // FOOTER
        // ==========================================
        
        // Footer bar
        const footerGradient = ctx.createLinearGradient(0, height - 60, 0, height);
        footerGradient.addColorStop(0, 'rgba(139, 92, 246, 0.3)');
        footerGradient.addColorStop(1, 'rgba(139, 92, 246, 0.1)');
        ctx.fillStyle = footerGradient;
        ctx.fillRect(0, height - 60, width, 60);
        
        // Logo
        ctx.font = '35px Arial';
        ctx.fillText('🐸', 40, height - 18);
        
        ctx.fillStyle = '#8b5cf6';
        ctx.font = 'bold 30px Arial';
        ctx.fillText('Pepeline AI Agents', 90, height - 18);
        
        // URL
        ctx.fillStyle = '#9ca3af';
        ctx.font = '25px Arial';
        ctx.fillText('pepeline.com/agents-dashboard', width - 400, height - 18);
        
        // ==========================================
        // CONVERT
        // ==========================================
        
        const buffer = canvas.toBuffer('image/png');
        
        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'image/png',
                'Content-Length': buffer.length.toString(),
                'Cache-Control': 'no-cache'
            }
        });
        
    } catch (error) {
        console.error('Image generation error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

function getCoinEmoji(coin) {
    const emojis = {
        'BTC': '₿',
        'ETH': 'Ξ',
        'SOL': '◎',
        'BNB': '💎',
        'DOGE': '🐕',
        'ADA': '🔷',
        'XRP': '💧',
        'MATIC': '🟣',
        'AVAX': '🔺',
        'DOT': '⚫'
    };
    return emojis[coin] || '🪙';
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let currentY = y;
    
    words.forEach((word) => {
        const testLine = line + word + ' ';
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > maxWidth && line !== '') {
            ctx.fillText(line, x, currentY);
            line = word + ' ';
            currentY += lineHeight;
        } else {
            line = testLine;
        }
    });
    ctx.fillText(line, x, currentY);
}
