export const dynamic = 'force-dynamic';
import { createClient } from '@supabase/supabase-js';

function getAdmin() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_KEY
    );
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'demo';

    try {
        const supabase = getAdmin();
        const { data, error } = await supabase
            .from('paper_trades')
            .select('*')
            .eq('user_id', userId)
            .order('entry_time', { ascending: false });

        if (error) throw error;

        const closedTrades = (data || []).filter(t => t.status === 'closed');
        const wins = closedTrades.filter(t => (t.pnl_usd || 0) > 0).length;
        const totalPnl = closedTrades.reduce((sum, t) => sum + (parseFloat(t.pnl_usd) || 0), 0);

        return Response.json({
            trades: data || [],
            stats: {
                total: (data || []).length,
                open: (data || []).filter(t => t.status === 'open').length,
                closed: closedTrades.length,
                wins,
                losses: closedTrades.length - wins,
                winRate: closedTrades.length > 0 ? ((wins / closedTrades.length) * 100).toFixed(1) : '0',
                totalPnl: totalPnl.toFixed(2),
                avgPnl: closedTrades.length > 0 ? (totalPnl / closedTrades.length).toFixed(2) : '0'
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { action, userId = 'demo', ...tradeData } = body;
        const supabase = getAdmin();

        if (action === 'open') {
            const { data, error } = await supabase
                .from('paper_trades')
                .insert({
                    user_id: userId,
                    symbol: tradeData.symbol,
                    signal: tradeData.signal,
                    entry_price: tradeData.price,
                    quantity: tradeData.quantity || 1,
                    confidence: tradeData.confidence,
                    strength: tradeData.strength
                })
                .select();

            if (error) throw error;
            return Response.json({ success: true, trade: data[0] });
        }

        if (action === 'close') {
            const { tradeId, exitPrice } = tradeData;
            const { data: trade } = await supabase
                .from('paper_trades')
                .select('*')
                .eq('id', tradeId)
                .single();

            if (!trade) throw new Error('Trade not found');

            const pnlUsd = (exitPrice - trade.entry_price) * trade.quantity;
            const pnlPct = ((exitPrice - trade.entry_price) / trade.entry_price) * 100;

            const { data, error } = await supabase
                .from('paper_trades')
                .update({
                    exit_price: exitPrice,
                    exit_time: new Date().toISOString(),
                    pnl_usd: pnlUsd,
                    pnl_pct: pnlPct,
                    status: 'closed'
                })
                .eq('id', tradeId)
                .select();

            if (error) throw error;
            return Response.json({ success: true, trade: data[0] });
        }

        return Response.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
