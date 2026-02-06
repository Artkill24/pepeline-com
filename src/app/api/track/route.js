import { trackClick } from '@/lib/analytics-tracker';

export const dynamic = 'force-dynamic';

export async function POST(request) {
    try {
        const { source, url, action } = await request.json();
        
        const stats = trackClick(source || 'unknown', url || 'homepage');
        
        return Response.json({
            success: true,
            totalClicks: stats.totalClicks,
            action: action || 'click'
        });
        
    } catch (error) {
        console.error('Analytics error:', error);
        return Response.json({ error: 'Failed to track' }, { status: 500 });
    }
}

export async function GET(request) {
    const url = new URL(request.url);
    const destination = url.searchParams.get('url') || 'https://pepeline.com';
    const source = url.searchParams.get('source') || 'direct';
    
    trackClick(source, destination);
    
    return Response.redirect(destination, 302);
}
