/**
 * Tweet Image Generator
 * Creates beautiful AI-enhanced images for Twitter posts
 */

import { createCanvas, loadImage, registerFont } from 'canvas';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// Canvas-based image generation (NO AI needed - FREE!)
export async function generateTradeTweetImage(trade) {
    const width = 1200;
    const height = 675;
    
    // Create canvas
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    // Background gradient (crypto vibe)
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#0f172a'); // Dark blue
    gradient.addColorStop(0.5, '#1e1b4b'); // Purple
    gradient.addColorStop(1, '#831843'); // Pink
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Add noise texture for depth
    for (let i = 0; i < 1000; i++) {
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.05})`;
        ctx.fillRect(Math.random() * width, Math.random() * height, 2, 2);
    }
    
    // === HEADER ===
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Arial';
    ctx.fillText('🐸 PEPELINE AI AGENT', 60, 80);
    
    // === TRADE ACTION (Big and Bold) ===
    const actionColor = trade.action === 'BUY' ? '#10b981' : '#ef4444';
    ctx.fillStyle = actionColor;
    ctx.font = 'bold 120px Arial';
    ctx.fillText(trade.action, 60, 220);
    
    // === COIN ===
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 90px Arial';
    ctx.fillText(trade.coin, 60, 330);
    
    // === PRICE BOX ===
    ctx.fillStyle = 'rgba(139, 92, 246, 0.3)';
    ctx.fillRect(50, 360, 500, 120);
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 3;
    ctx.strokeRect(50, 360, 500, 120);
    
    ctx.fillStyle = '#9ca3af';
    ctx.font = '32px Arial';
    ctx.fillText('ENTRY PRICE', 70, 400);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Arial';
    ctx.fillText(`$${trade.price.toLocaleString()}`, 70, 455);
    
    // === STRENGTH METER ===
    ctx.fillStyle = '#9ca3af';
    ctx.font = '28px Arial';
    ctx.fillText('SIGNAL STRENGTH', 600, 400);
    
    // Progress bar
    const barWidth = 500;
    const barHeight = 40;
    const barX = 600;
    const barY = 420;
    
    // Background bar
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(barX, barY, barWidth, barHeight);
    
    // Filled bar
    const fillWidth = (trade.strength / 100) * barWidth;
    const barGradient = ctx.createLinearGradient(barX, barY, barX + fillWidth, barY);
    barGradient.addColorStop(0, '#8b5cf6');
    barGradient.addColorStop(1, '#ec4899');
    ctx.fillStyle = barGradient;
    ctx.fillRect(barX, barY, fillWidth, barHeight);
    
    // Strength text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px Arial';
    ctx.fillText(`${trade.strength}/100`, barX + barWidth + 20, barY + 32);
    
    // === P&L (if available) ===
    if (trade.pnl_percent !== undefined) {
        const pnlColor = trade.pnl_percent >= 0 ? '#10b981' : '#ef4444';
        ctx.fillStyle = pnlColor;
        ctx.font = 'bold 64px Arial';
        const pnlText = `${trade.pnl_percent >= 0 ? '+' : ''}${trade.pnl_percent.toFixed(2)}%`;
        ctx.fillText(pnlText, 60, 560);
        
        ctx.fillStyle = '#9ca3af';
        ctx.font = '28px Arial';
        ctx.fillText('PROFIT/LOSS', 60, 600);
    }
    
    // === AI REASONING BOX ===
    ctx.fillStyle = 'rgba(139, 92, 246, 0.2)';
    ctx.fillRect(50, 510, width - 100, 100);
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 2;
    ctx.strokeRect(50, 510, width - 100, 100);
    
    ctx.fillStyle = '#a78bfa';
    ctx.font = 'bold 24px Arial';
    ctx.fillText('🧠 AI REASONING', 70, 545);
    
    ctx.fillStyle = '#e5e7eb';
    ctx.font = '22px Arial';
    const reasoning = trade.llm_reasoning?.substring(0, 100) || 'Automated execution based on signal strength';
    ctx.fillText(reasoning + '...', 70, 580);
    
    // === FOOTER ===
    ctx.fillStyle = '#6b7280';
    ctx.font = '24px Arial';
    ctx.fillText('pepeline.com/agents-dashboard', 60, 645);
    
    ctx.fillStyle = '#8b5cf6';
    ctx.font = 'bold 28px Arial';
    ctx.fillText('LIVE NOW →', width - 200, 645);
    
    // Convert to buffer
    const buffer = canvas.toBuffer('image/png');
    
    // Optimize with sharp
    const optimized = await sharp(buffer)
        .png({ quality: 90, compressionLevel: 9 })
        .toBuffer();
    
    return optimized;
}

// Generate comparison/portfolio images
export async function generatePortfolioImage(stats) {
    const width = 1200;
    const height = 675;
    
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    // Similar gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#0f172a');
    gradient.addColorStop(1, '#1e1b4b');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 52px Arial';
    ctx.fillText('🤖 AI AGENT PERFORMANCE', 60, 80);
    
    // Stats grid
    const statsData = [
        { label: 'Total Trades', value: stats.totalTrades, color: '#8b5cf6' },
        { label: 'Win Rate', value: `${stats.winRate}%`, color: '#10b981' },
        { label: 'Total P&L', value: `${stats.totalPnL >= 0 ? '+' : ''}${stats.totalPnL.toFixed(2)}%`, color: stats.totalPnL >= 0 ? '#10b981' : '#ef4444' }
    ];
    
    const boxWidth = 350;
    const boxHeight = 180;
    const spacing = 40;
    let xPos = 60;
    const yPos = 150;
    
    statsData.forEach((stat, i) => {
        // Box
        ctx.fillStyle = 'rgba(139, 92, 246, 0.2)';
        ctx.fillRect(xPos, yPos, boxWidth, boxHeight);
        ctx.strokeStyle = stat.color;
        ctx.lineWidth = 3;
        ctx.strokeRect(xPos, yPos, boxWidth, boxHeight);
        
        // Label
        ctx.fillStyle = '#9ca3af';
        ctx.font = '28px Arial';
        ctx.fillText(stat.label, xPos + 20, yPos + 50);
        
        // Value
        ctx.fillStyle = stat.color;
        ctx.font = 'bold 64px Arial';
        ctx.fillText(stat.value, xPos + 20, yPos + 130);
        
        xPos += boxWidth + spacing;
    });
    
    // Recent trades
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px Arial';
    ctx.fillText('RECENT ACTIVITY', 60, 420);
    
    // Footer
    ctx.fillStyle = '#6b7280';
    ctx.font = '24px Arial';
    ctx.fillText('Powered by Groq LLM • pepeline.com', 60, 645);
    
    const buffer = canvas.toBuffer('image/png');
    const optimized = await sharp(buffer)
        .png({ quality: 90, compressionLevel: 9 })
        .toBuffer();
    
    return optimized;
}

// Save image to public folder
export async function saveTweetImage(imageBuffer, filename) {
    const outputPath = path.join(process.cwd(), 'public', 'tweets', filename);
    
    // Create tweets directory if not exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    
    await sharp(imageBuffer)
        .png()
        .toFile(outputPath);
    
    return `/tweets/${filename}`;
}
