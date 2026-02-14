import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const revalidate = 300; // 5 min cache

function getAdmin() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_KEY
    );
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');
    const limit = Math.min(days * 24, 720); // max 30 days hourly = 720 points

    try {
        const supabase = getAdmin();

        const since = new Date();
        since.setDate(since.getDate() - days);

        const { data, error } = await supabase
            .from('index_history')
            .select('index_value, level, btc_price, created_at')
            .gte('created_at', since.toISOString())
            .order('created_at', { ascending: true })
            .limit(limit);

        if (error) throw error;

        // If no real data yet, return demo data
        if (!data || data.length < 2) {
            return Response.json({
                history: generateDemoData(days),
                isDemo: true,
                message: 'Demo data — real data will appear after first cron run'
            });
        }

        // Downsample if too many points (max 90 points for chart)
        const maxPoints = 90;
        const history = data.length > maxPoints
            ? downsample(data, maxPoints)
            : data;

        return Response.json({
            history: history.map(row => ({
                date: row.created_at,
                index: parseFloat(row.index_value),
                level: row.level,
                btc: parseFloat(row.btc_price || 0)
            })),
            isDemo: false,
            total: data.length,
            days
        });

    } catch (error) {
        console.error('History fetch error:', error);
        return Response.json({
            history: generateDemoData(days),
            isDemo: true,
            error: error.message
        });
    }
}

// Downsample array to n points evenly
function downsample(arr, n) {
    if (arr.length <= n) return arr;
    const result = [];
    const step = arr.length / n;
    for (let i = 0; i < n; i++) {
        result.push(arr[Math.floor(i * step)]);
    }
    return result;
}

// Generate realistic demo data for empty state
function generateDemoData(days) {
    const data = [];
    const now = new Date();
    let index = 45;
    let btc = 65000;

    for (let i = days; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);

        // Simulate realistic movement
        index += (Math.random() - 0.48) * 6;
        index = Math.max(5, Math.min(95, index));

        btc += (Math.random() - 0.47) * 800;
        btc = Math.max(55000, Math.min(110000, btc));

        const level = index >= 80 ? 'EXTREME GREED' :
                      index >= 60 ? 'GREED' :
                      index >= 40 ? 'NEUTRAL' :
                      index >= 20 ? 'FEAR' : 'EXTREME FEAR';

        data.push({
            date: date.toISOString(),
            index: parseFloat(index.toFixed(1)),
            level,
            btc: parseFloat(btc.toFixed(0))
        });
    }
    return data;
}
