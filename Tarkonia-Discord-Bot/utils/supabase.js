import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

export async function logTeamKill(killerId, victimId) {
  const { data, error } = await supabase
    .from('teamkills')
    .insert([{ killer_id: killerId, victim_id: victimId }]);

  if (error) throw error;
  return data;
}

export async function getTeamKillLeaderboard() {
  const { data, error } = await supabase
    .from('teamkills')
    .select('killer_id, count(*)')
    .group('killer_id')
    .order('count', { ascending: false })
    .limit(10);

  if (error) throw error;
  return data;
}

export async function trackUserActivity(userId, activity) {
  const { data, error } = await supabase
    .from('user_activity')
    .insert([{ user_id: userId, activity: activity }]);

  if (error) throw error;
  return data;
}

export async function getUserStats(userId) {
  const { data, error } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function updateUserStats(userId, stats) {
  const { data, error } = await supabase
    .from('user_stats')
    .upsert({ user_id: userId, ...stats })
    .select();

  if (error) throw error;
  return data;
}

export async function initializeServerConfig(guildId, config) {
  const { data, error } = await supabase
    .from('server_configs')
    .upsert({ 
      guild_id: guildId,
      welcome_channel_id: config.welcomeChannelId,
      rules_channel_id: config.rulesChannelId,
      announcements_channel_id: config.announcementsChannelId,
      logs_channel_id: config.logsChannelId,
      bot_logs_channel_id: config.botLogsChannelId,
      general_channel_id: config.generalChannelId,
      member_leaderboard_channel_id: config.memberLeaderboardChannelId,
      team_kill_leaderboard_channel_id: config.teamKillLeaderboardChannelId,
      support_channel_id: config.supportChannelId,
      admin_role_id: config.adminRoleId,
      moderator_role_id: config.moderatorRoleId,
      member_role_id: config.memberRoleId,
    })
    .select();

  if (error) throw error;
  return data;
}

export async function getServerConfig(guildId) {
  const { data, error } = await supabase
    .from('server_configs')
    .select('*')
    .eq('guild_id', guildId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

