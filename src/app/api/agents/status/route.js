import { NextResponse } from 'next/server';

// Agent status tracking (in production, usa Redis/DB)
let agentState = {
    status: 'stopped',
    lastCycle: null,
    totalTrades: 0,
    successfulTrades: 0,
    openPositions: [],
    tradeHistory: []
};

export async function GET(request) {
    return NextResponse.json({
        success: true,
        ...agentState,
        timestamp: new Date().toISOString()
    });
}

export async function POST(request) {
    const body = await request.json();
    
    if (body.action === 'start') {
        agentState.status = 'running';
    } else if (body.action === 'stop') {
        agentState.status = 'stopped';
    } else if (body.action === 'add_trade') {
        agentState.tradeHistory.unshift(body.trade);
        agentState.totalTrades++;
        if (body.trade.action === 'BUY') {
            agentState.openPositions.push(body.trade);
        }
    }
    
    return NextResponse.json({
        success: true,
        ...agentState
    });
}
