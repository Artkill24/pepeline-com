export const dynamic = 'force-dynamic';

export async function GET(request) {
    // Protezione — solo Railway può chiamare questo endpoint
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // 1. Fetch indice attuale
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pepeline.com';
        const indexRes = await fetch(`${baseUrl}/api/index`);
        const indexData = await indexRes.json();

        if (!indexData || !indexData.index) {
            return Response.json({ success: false, error: 'Could not fetch index' }, { status: 500 });
        }

        // 2. Post tweet
        const tweetRes = await fetch(`${baseUrl}/api/post-tweet`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${process.env.CRON_SECRET}`,
            },
            body: JSON.stringify({
                type: 'sentiment',
                data: {
                    index: indexData.index,
                    emoji: indexData.emoji || '🐸',
                    level: indexData.level || indexData.label || 'FEAR',
                    change: indexData.change || 0,
                },
            }),
        });

        const result = await tweetRes.json();
        console.log('🐸 Auto-tweet result:', result);

        return Response.json({
            success: result.success,
            tweet_id: result.id,
            index: indexData.index,
            level: indexData.level,
            timestamp: new Date().toISOString(),
        });

    } catch (error) {
        console.error('❌ Cron tweet error:', error);
        return Response.json({ success: false, error: error.message }, { status: 500 });
    }
}
