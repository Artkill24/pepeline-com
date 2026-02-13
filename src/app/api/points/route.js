import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const POINTS_CONFIG = {
    daily_visit: { points: 5, daily: true },
    telegram_bot: { points: 10, daily: true },
    connect_wallet: { points: 20, daily: false },
    share_twitter: { points: 15, daily: true, maxPerDay: 3 },
    refer_friend: { points: 25, daily: false },
    read_brief: { points: 3, daily: true },
    use_dashboard: { points: 5, daily: true },
};

// GET - fetch user points
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const wallet = searchParams.get('wallet');

    if (!wallet) {
        // Return leaderboard
        const { data, error } = await supabaseAdmin
            .from('whitelist_users')
            .select('wallet_address, points, whitelisted')
            .order('points', { ascending: false })
            .limit(100);

        if (error) return Response.json({ error: error.message }, { status: 500 });

        return Response.json({
            leaderboard: data,
            total: data.length
        });
    }

    // Return specific user
    const { data, error } = await supabaseAdmin
        .from('whitelist_users')
        .select('*')
        .eq('wallet_address', wallet.toLowerCase())
        .single();

    if (error && error.code !== 'PGRST116') {
        return Response.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
        return Response.json({ exists: false, points: 0 });
    }

    // Get rank
    const { count } = await supabaseAdmin
        .from('whitelist_users')
        .select('*', { count: 'exact', head: true })
        .gt('points', data.points);

    return Response.json({
        ...data,
        rank: (count || 0) + 1,
        whitelisted: data.points >= 100,
        priority: data.points >= 250,
        og: data.points >= 500
    });
}

// POST - add points for action
export async function POST(request) {
    try {
        const body = await request.json();
        const { wallet, action, telegram_handle, twitter_handle, referral_code } = body;

        if (!wallet || !action) {
            return Response.json({ error: 'wallet and action required' }, { status: 400 });
        }

        const walletLower = wallet.toLowerCase();
        const config = POINTS_CONFIG[action];

        if (!config) {
            return Response.json({ error: 'Invalid action' }, { status: 400 });
        }

        // Get or create user
        let { data: user } = await supabaseAdmin
            .from('whitelist_users')
            .select('*')
            .eq('wallet_address', walletLower)
            .single();

        if (!user) {
            // Create new user
            const { data: newUser, error: createError } = await supabaseAdmin
                .from('whitelist_users')
                .insert({
                    wallet_address: walletLower,
                    telegram_handle: telegram_handle || null,
                    twitter_handle: twitter_handle || null,
                    points: 0,
                    visits: 0,
                    referrals: 0,
                    bot_used: false,
                    tweets_shared: 0
                })
                .select()
                .single();

            if (createError) return Response.json({ error: createError.message }, { status: 500 });
            user = newUser;

            // Handle referral
            if (referral_code) {
                await supabaseAdmin
                    .from('whitelist_users')
                    .update({
                        points: supabaseAdmin.raw('points + 25'),
                        referrals: supabaseAdmin.raw('referrals + 1')
                    })
                    .eq('wallet_address', referral_code.toLowerCase());
            }
        }

        // Check daily limit
        if (config.daily) {
            const today = new Date().toISOString().split('T')[0];
            const { data: todayActions } = await supabaseAdmin
                .from('point_actions')
                .select('*')
                .eq('wallet_address', walletLower)
                .eq('action', action)
                .gte('created_at', today);

            const maxToday = config.maxPerDay || 1;
            if (todayActions && todayActions.length >= maxToday) {
                return Response.json({
                    success: false,
                    message: 'Already claimed today',
                    points: user.points
                });
            }
        } else {
            // Check if already done (non-daily)
            const { data: existingAction } = await supabaseAdmin
                .from('point_actions')
                .select('*')
                .eq('wallet_address', walletLower)
                .eq('action', action)
                .single();

            if (existingAction) {
                return Response.json({
                    success: false,
                    message: 'Already completed',
                    points: user.points
                });
            }
        }

        // Add points
        const newPoints = user.points + config.points;
        const updates = {
            points: newPoints,
            updated_at: new Date().toISOString(),
            whitelisted: newPoints >= 100
        };

        if (action === 'daily_visit') updates.visits = (user.visits || 0) + 1;
        if (action === 'telegram_bot') updates.bot_used = true;
        if (action === 'share_twitter') updates.tweets_shared = (user.tweets_shared || 0) + 1;
        if (telegram_handle) updates.telegram_handle = telegram_handle;
        if (twitter_handle) updates.twitter_handle = twitter_handle;

        await supabaseAdmin
            .from('whitelist_users')
            .update(updates)
            .eq('wallet_address', walletLower);

        // Log action
        await supabaseAdmin
            .from('point_actions')
            .insert({
                wallet_address: walletLower,
                action,
                points_earned: config.points
            });

        return Response.json({
            success: true,
            points_earned: config.points,
            total_points: newPoints,
            whitelisted: newPoints >= 100,
            priority: newPoints >= 250,
            og: newPoints >= 500
        });

    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
