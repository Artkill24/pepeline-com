export const dynamic = 'force-dynamic';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    
    if (secret !== process.env.CRON_SECRET) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Import direct per evitare self-fetch in dev
        const { GET: getIndex } = await import('@/app/api/index/route');
        const indexRes = await getIndex();
        const indexData = await indexRes.json();

        if (!indexData || !indexData.index) {
            return Response.json({ success: false, error: 'Could not fetch index' }, { status: 500 });
        }

        // Post tweet
        const { POST: postTweet } = await import('@/app/api/post-tweet/route');
        const tweetReq = new Request('http://localhost/api/post-tweet', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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

        const tweetRes = await postTweet(tweetReq);
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
