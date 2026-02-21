export const dynamic = 'force-dynamic';

export async function POST(request) {
    const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK_URL;
    
    try {
        const body = await request.json();
        const { type, data } = body;

        if (!DISCORD_WEBHOOK) {
            return Response.json({ success: false, message: 'Webhook not configured' });
        }

        let title, description, color = 5814783;
        
        if (type === 'extreme_index') {
            color = data.index > 80 ? 16711680 : 65280;
            title = data.index > 80 ? '🔴 EXTREME GREED' : '🟢 EXTREME FEAR';
            description = `Index: **${data.index}** (${data.level})`;
        } else if (type === 'strong_signal') {
            color = data.signal === 'BUY' ? 65280 : 16711680;
            title = `${data.signal === 'BUY' ? '🟢' : '🔴'} ${data.symbol} ${data.signal}`;
            description = `Strength: ${data.strength}/100 | Confidence: ${data.confidence}`;
        }

        const embed = {
            title,
            description,
            color,
            timestamp: new Date().toISOString(),
            footer: { text: 'Pepeline' }
        };

        await fetch(DISCORD_WEBHOOK, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ embeds: [embed] })
        });

        return Response.json({ success: true, type });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
