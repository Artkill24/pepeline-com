import { NextResponse } from 'next/server';
import { createCanvas } from 'canvas';
import { getCoinPrice } from '@/lib/real-time-prices';

export async function POST(request) {
    const { trade } = await request.json();
    
    try {
        // GET REAL-TIME PRICE
        const realTimeData = await getCoinPrice(trade.coin);
        
        // Use real price if available, fallback to trade price
        const currentPrice = realTimeData.price || trade.price;
        const change24h = realTimeData.change24h || trade.change24h || 0;
        
        // Create canvas
        const width = 1200;
        const height = 675;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');
        
        // ==========================================
        // BACKGROUND - Crypto Gradient
        // ==========================================
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#0f172a');
        gradient.addColorStop(0.5, '#1e1b4b');
        gradient.addColorStop(1, '#831843');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Grid pattern
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.1)';
        ctx.lineWidth = 2;
        for (let i = 0; i < 20; i++) {
            ctx.beginPath();
            ctx.moveTo(i * 60, 0);
            ctx.lineTo(width, height - i * 60);
            ctx.stroke();
        }
        
        // ==========================================
        // TOP BAR - Action Badge
        // ==========================================
        const actionColor = trade.action === 'BUY' ? '#10b981' : '#ef4444';
        
        ctx.fillStyle = actionColor;
        ctx.fillRect(50, 40, 300, 70);
        
        ctx.strokeStyle = actionColor;
        ctx.lineWidth = 3;
        ctx.strokeRect(50, 40, 300, 70);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 45px Arial';
        ctx.fillText(`${trade.action} SIGNAL`, 75, 90);
        
        // ==========================================
        // COIN INFO - Left Panel
        // ==========================================
        
        // Coin Symbol + Emoji
        const coinEmojis = {
            'BTC': '₿',
            'ETH': 'Ξ',
            'SOL': '◎',
            'BNB': '💎',
            'DOGE': '🐕'
        };
        
        const emoji = coinEmojis[trade.coin] || '🪙';
        
        ctx.font = '90px Arial';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(emoji, 50, 210);
        
        ctx.font = 'bold 110px Arial';
        ctx.fillText(trade.coin, 180, 210);
        
        // REAL-TIME Price
        ctx.fillStyle = '#e5e7eb';
        ctx.font = 'bold 55px Arial';
        ctx.fillText(`$${currentPrice.toLocaleString()}`, 50, 290);
        
        // 24h Change indicator
        const changeColor = change24h >= 0 ? '#10b981' : '#ef4444';
        const changeArrow = change24h >= 0 ? '↗' : '↘';
        ctx.fillStyle = changeColor;
        ctx.font = 'bold 35px Arial';
        ctx.fillText(`${changeArrow} ${Math.abs(change24h).toFixed(2)}%`, 50, 340);
        
        // Divider
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(50, 370);
        ctx.lineTo(580, 370);
        ctx.stroke();
        
        // ==========================================
        // METRICS
        // ==========================================
        
        const metrics = [
            { label: '💰 Position Size', value: `$${trade.size}` },
            { label: '⚡ Strength', value: `${trade.strength}/100` },
            { label: '📊 P&L', value: trade.pnl_percent ? `${trade.pnl_percent >= 0 ? '+' : ''}${trade.pnl_percent.toFixed(2)}%` : 'Pending' }
        ];
        
        let y = 420;
        metrics.forEach(m => {
            ctx.fillStyle = '#9ca3af';
            ctx.font = '28px Arial';
            ctx.fillText(m.label, 50, y);
            
            ctx.fillStyle = m.label.includes('P&L') && trade.pnl_percent
                ? (trade.pnl_percent >= 0 ? '#10b981' : '#ef4444')
                : '#ffffff';
            ctx.font = 'bold 40px Arial';
            ctx.fillText(m.value, 50, y + 40);
            
            y += 90;
        });
        
        // ==========================================
        // RIGHT PANEL - AI Reasoning
        // ==========================================
        
        ctx.fillStyle = 'rgba(139, 92, 246, 0.1)';
        ctx.fillRect(620, 40, 540, 580);
        
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.5)';
        ctx.lineWidth = 3;
        ctx.strokeRect(620, 40, 540, 580);
        
        // AI Badge
        ctx.fillStyle = '#8b5cf6';
        ctx.fillRect(650, 70, 180, 50);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 28px Arial';
        ctx.fillText('🧠 AI REASONING', 665, 105);
        
        // Reasoning text (wrapped)
        ctx.fillStyle = '#e5e7eb';
        ctx.font = '26px Arial';
        const reasoning = trade.llm_reasoning || 'Automated trade execution based on signal strength.';
        wrapText(ctx, reasoning, 650, 160, 480, 36);
        
        // Confidence bar
        ctx.fillStyle = '#374151';
        ctx.fillRect(650, 550, 480, 30);
        
        const confWidth = (trade.strength / 100) * 480;
        const confGradient = ctx.createLinearGradient(650, 0, 650 + confWidth, 0);
        confGradient.addColorStop(0, '#10b981');
        confGradient.addColorStop(1, '#3b82f6');
        ctx.fillStyle = confGradient;
        ctx.fillRect(650, 550, confWidth, 30);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 22px Arial';
        ctx.fillText(`Confidence: ${trade.strength}%`, 850, 572);
        
        // ==========================================
        // FOOTER
        // ==========================================
        
        const footerGradient = ctx.createLinearGradient(0, height - 60, 0, height);
        footerGradient.addColorStop(0, 'rgba(139, 92, 246, 0.3)');
        footerGradient.addColorStop(1, 'rgba(139, 92, 246, 0.1)');
        ctx.fillStyle = footerGradient;
        ctx.fillRect(0, height - 60, width, 60);
        
        ctx.font = '35px Arial';
        ctx.fillText('🐸', 40, height - 18);
        
        ctx.fillStyle = '#8b5cf6';
        ctx.font = 'bold 30px Arial';
        ctx.fillText('Pepeline AI Agents', 90, height - 18);
        
        ctx.fillStyle = '#9ca3af';
        ctx.font = '25px Arial';
        ctx.fillText('pepeline.com/agents', width - 350, height - 18);
        
        // Timestamp
        const timestamp = new Date().toLocaleString('en-US', {
            month: 'numeric',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
        ctx.fillStyle = '#6b7280';
        ctx.font = '22px Arial';
        ctx.fillText(timestamp, 650, 595);
        
        // ==========================================
        // CONVERT TO BUFFER
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
