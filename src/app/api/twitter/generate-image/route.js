import { NextResponse } from 'next/server';
import { createCanvas, loadImage } from 'canvas';

export async function POST(request) {
    const { trade } = await request.json();
    
    try {
        // Create 1200x675 image (Twitter optimal)
        const width = 1200;
        const height = 675;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');
        
        // ==========================================
        // BACKGROUND - Gradient
        // ==========================================
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(0.5, '#16213e');
        gradient.addColorStop(1, '#0f3460');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Add subtle pattern
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.1)';
        ctx.lineWidth = 2;
        for (let i = 0; i < 20; i++) {
            ctx.beginPath();
            ctx.moveTo(i * 60, 0);
            ctx.lineTo(width, height - i * 60);
            ctx.stroke();
        }
        
        // ==========================================
        // HEADER - Action Badge
        // ==========================================
        const actionColor = trade.action === 'BUY' ? '#10b981' : '#ef4444';
        const actionBg = trade.action === 'BUY' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)';
        
        // Badge background
        ctx.fillStyle = actionBg;
        ctx.fillRect(50, 50, 300, 80);
        
        // Badge border
        ctx.strokeStyle = actionColor;
        ctx.lineWidth = 3;
        ctx.strokeRect(50, 50, 300, 80);
        
        // Badge text
        ctx.fillStyle = actionColor;
        ctx.font = 'bold 50px Arial';
        ctx.fillText(`${trade.action} SIGNAL`, 70, 105);
        
        // ==========================================
        // COIN INFO
        // ==========================================
        
        // Coin symbol - HUGE
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 120px Arial';
        ctx.fillText(trade.coin, 50, 250);
        
        // Price
        ctx.fillStyle = '#9ca3af';
        ctx.font = 'bold 50px Arial';
        ctx.fillText(`$${trade.price.toLocaleString()}`, 50, 320);
        
        // ==========================================
        // METRICS GRID
        // ==========================================
        
        const metrics = [
            { label: 'Size', value: `$${trade.size}`, color: '#8b5cf6' },
            { label: 'Strength', value: `${trade.strength}/100`, color: '#3b82f6' },
            { label: 'P&L', value: trade.pnl_percent ? `${trade.pnl_percent >= 0 ? '+' : ''}${trade.pnl_percent.toFixed(2)}%` : 'N/A', color: trade.pnl_percent >= 0 ? '#10b981' : '#ef4444' }
        ];
        
        let metricY = 400;
        metrics.forEach((metric, i) => {
            // Label
            ctx.fillStyle = '#6b7280';
            ctx.font = '30px Arial';
            ctx.fillText(metric.label, 50, metricY);
            
            // Value
            ctx.fillStyle = metric.color;
            ctx.font = 'bold 45px Arial';
            ctx.fillText(metric.value, 50, metricY + 45);
            
            metricY += 100;
        });
        
        // ==========================================
        // AI REASONING BOX
        // ==========================================
        
        // Box background
        ctx.fillStyle = 'rgba(139, 92, 246, 0.1)';
        ctx.fillRect(500, 50, 650, 550);
        
        // Box border
        ctx.strokeStyle = '#8b5cf6';
        ctx.lineWidth = 3;
        ctx.strokeRect(500, 50, 650, 550);
        
        // AI Badge
        ctx.fillStyle = '#8b5cf6';
        ctx.font = 'bold 30px Arial';
        ctx.fillText('🧠 AI REASONING', 530, 100);
        
        // Reasoning text (wrapped)
        ctx.fillStyle = '#e5e7eb';
        ctx.font = '28px Arial';
        const maxWidth = 600;
        const lineHeight = 40;
        const reasoning = trade.llm_reasoning || 'Automated trade execution based on signal strength and market conditions.';
        const words = reasoning.split(' ');
        let line = '';
        let y = 160;
        
        words.forEach((word) => {
            const testLine = line + word + ' ';
            const metrics = ctx.measureText(testLine);
            
            if (metrics.width > maxWidth && line !== '') {
                ctx.fillText(line, 530, y);
                line = word + ' ';
                y += lineHeight;
            } else {
                line = testLine;
            }
        });
        ctx.fillText(line, 530, y);
        
        // ==========================================
        // FOOTER - Branding
        // ==========================================
        
        // Logo background
        ctx.fillStyle = 'rgba(139, 92, 246, 0.2)';
        ctx.fillRect(0, height - 80, width, 80);
        
        // Pepeline branding
        ctx.fillStyle = '#8b5cf6';
        ctx.font = 'bold 40px Arial';
        ctx.fillText('🐸 Pepeline AI Agents', 50, height - 30);
        
        // URL
        ctx.fillStyle = '#6b7280';
        ctx.font = '30px Arial';
        ctx.fillText('pepeline.com/agents', 600, height - 30);
        
        // Timestamp
        ctx.fillStyle = '#4b5563';
        ctx.font = '25px Arial';
        const timestamp = new Date().toLocaleString();
        ctx.fillText(timestamp, width - 300, height - 35);
        
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
        
        return NextResponse.json({
            error: 'Failed to generate image',
            details: error.message
        }, { status: 500 });
    }
}
