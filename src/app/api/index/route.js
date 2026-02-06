import { calculatePepelineIndex } from '@/lib/pepeline-calculator';
import { getCache, setCache } from '@/lib/cache-helper';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Check cache first (30 second TTL)
        const cached = getCache('pepeline-index');
        if (cached) {
            return Response.json(cached);
        }

        const index = await calculatePepelineIndex();
        
        // Cache result
        setCache('pepeline-index', index, 30);
        
        return Response.json(index);
        
    } catch (error) {
        console.error('Index API error:', error);
        return Response.json({
            index: 50,
            level: 'NEUTRAL',
            emoji: '😐',
            error: 'Calculation failed'
        }, { status: 500 });
    }
}
