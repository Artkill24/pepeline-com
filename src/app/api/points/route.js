import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function getAdmin() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_KEY
    );
}

const POINTS_CONFIG = {
    daily_visit:    { points: 5,  daily: true,  maxPerDay: 1 },
    telegram_bot:   { points: 10, daily: true,  maxPerDay: 1 },
    connect_wallet: { points: 20, daily: false },
    share_twitter:  { points: 15, daily: true,  maxPerDay: 3 },
    refer_friend:   { points: 25, daily: false },
    read_brief:     { points: 3,  daily: true,  maxPerDay: 1 },
    use_dashboard:  { points: 5,  daily: true,  maxPerDay: 1 },
};

// ─── GET ────────────────────────────────────────────────────────────────────
export async function GET(request) {
    const supabaseAdmin = getAdmin();
    const { searchParams } = new URL(request.url);
    const wallet = searchParams.get('wallet');

    // ── Leaderboard (no wallet param) ──────────────────────────────────────
    if (!wallet) {
        const [leaderboardRes, totalRes, whitelistedRes] = await Promise.all([
            supabaseAdmin
                .from('whitelist_users')
                .select('wallet_address, points, whitelisted, visits')
                .order('points', { ascending: false })
                .limit(50),
            supabaseAdmin
                .from('whitelist_users')
                .select('*', { count: 'exact', head: true }),
            supabaseAdmin
                .from('whitelist_users')
                .select('*', { count: 'exact', head: true })
                .gte('points', 100),
        ]);

        return Response.json({
            leaderboard: leaderboardRes.data || [],
            total_users: totalRes.count      || 0,
            whitelisted: whitelistedRes.count || 0,
        });
    }

    // ── Single user ────────────────────────────────────────────────────────
    const { data, error } = await supabaseAdmin
        .from('whitelist_users')
        .select('*')
        .eq('wallet_address', wallet)
        .single();

    if (error || !data) return Response.json({ exists: false, points: 0, claimed_today: [] });

    // Rank
    const { count: aboveCount } = await supabaseAdmin
        .from('whitelist_users')
        .select('*', { count: 'exact', head: true })
        .gt('points', data.points);

    // claimed_today
    const today = new Date().toISOString().split('T')[0];
    const { data: todayActions } = await supabaseAdmin
        .from('point_actions')
        .select('action')
        .eq('wallet_address', wallet)
        .gte('created_at', today + 'T00:00:00.000Z');

    const claimed_today = [...new Set((todayActions || []).map((a) => a.action))];

    return Response.json({
        ...data,
        rank:         (aboveCount || 0) + 1,
        whitelisted:  data.points >= 100,
        priority:     data.points >= 250,
        og:           data.points >= 500,
        claimed_today,
    });
}

// ─── POST ───────────────────────────────────────────────────────────────────
export async function POST(request) {
    const supabaseAdmin = getAdmin();
    try {
        const body = await request.json();
        const { wallet, action, telegram_handle, twitter_handle, referral_code } = body;

        if (!wallet || !action)
            return Response.json({ error: 'wallet and action required' }, { status: 400 });

        const config = POINTS_CONFIG[action];
        if (!config) return Response.json({ error: 'Invalid action' }, { status: 400 });

        // Get or create user
        let { data: user } = await supabaseAdmin
            .from('whitelist_users')
            .select('*')
            .eq('wallet_address', wallet)
            .single();

        if (!user) {
            const { data: newUser, error: createError } = await supabaseAdmin
                .from('whitelist_users')
                .insert({
                    wallet_address:  wallet,
                    telegram_handle: telegram_handle || null,
                    twitter_handle:  twitter_handle  || null,
                    points:          0,
                    visits:          0,
                    referrals:       0,
                    bot_used:        false,
                    tweets_shared:   0,
                })
                .select()
                .single();

            if (createError) return Response.json({ error: createError.message }, { status: 500 });
            user = newUser;

            // Credit referrer (only on first registration)
            if (referral_code && referral_code !== wallet) {
                const { data: referrer } = await supabaseAdmin
                    .from('whitelist_users')
                    .select('points, referrals')
                    .eq('wallet_address', referral_code)
                    .single();

                if (referrer) {
                    await supabaseAdmin
                        .from('whitelist_users')
                        .update({
                            points:    referrer.points + 25,
                            referrals: (referrer.referrals || 0) + 1,
                        })
                        .eq('wallet_address', referral_code);

                    await supabaseAdmin
                        .from('point_actions')
                        .insert({ wallet_address: referral_code, action: 'refer_friend', points_earned: 25, created_at: new Date().toISOString() });
                }
            }
        }

        // ── Daily limit check ─────────────────────────────────────────────
        if (config.daily) {
            const today = new Date().toISOString().split('T')[0];
            const { data: todayActions } = await supabaseAdmin
                .from('point_actions')
                .select('id')
                .eq('wallet_address', wallet)
                .eq('action', action)
                .gte('created_at', today + 'T00:00:00.000Z');

            if (todayActions && todayActions.length >= (config.maxPerDay || 1)) {
                return Response.json({
                    success: false,
                    message: 'Already claimed today',
                    points:  user.points,
                });
            }
        } else {
            // One-time action
            const { data: existingAction } = await supabaseAdmin
                .from('point_actions')
                .select('id')
                .eq('wallet_address', wallet)
                .eq('action', action)
                .single();

            if (existingAction) {
                return Response.json({
                    success: false,
                    message: 'Already completed',
                    points:  user.points,
                });
            }
        }

        // ── Add points ────────────────────────────────────────────────────
        const newPoints = (user.points || 0) + config.points;
        const updates = {
            points:      newPoints,
            updated_at:  new Date().toISOString(),
            whitelisted: newPoints >= 100,
        };

        if (action === 'daily_visit')   updates.visits        = (user.visits        || 0) + 1;
        if (action === 'telegram_bot')  updates.bot_used      = true;
        if (action === 'share_twitter') updates.tweets_shared = (user.tweets_shared || 0) + 1;
        if (telegram_handle)            updates.telegram_handle = telegram_handle;
        if (twitter_handle)             updates.twitter_handle  = twitter_handle;

        await supabaseAdmin
            .from('whitelist_users')
            .update(updates)
            .eq('wallet_address', wallet);

        await supabaseAdmin
            .from('point_actions')
            .insert({ wallet_address: wallet, action, points_earned: config.points, created_at: new Date().toISOString() });

        return Response.json({
            success:       true,
            points_earned: config.points,
            total_points:  newPoints,
            whitelisted:   newPoints >= 100,
            priority:      newPoints >= 250,
            og:            newPoints >= 500,
        });

    } catch (error) {
        console.error('Points error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}
