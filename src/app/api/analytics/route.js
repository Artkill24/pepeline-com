import { getAnalytics } from '@/lib/analytics-tracker';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const analytics = getAnalytics();
        
        return Response.json({
            success: true,
            data: analytics,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Analytics fetch error:', error);
        return Response.json({ error: 'Failed to get analytics' }, { status: 500 });
    }
}
