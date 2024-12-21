import { createClient } from '@supabase/supabase-js';
import logger from './logger.js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

export async function setCustomMessage(guildId, type, channelId, message) {
  try {
    if (!guildId || !type || !channelId || !message) {
      throw new Error('Missing required parameters');
    }

    const { data, error } = await supabase
      .from('custom_messages')
      .upsert({ guild_id: guildId, type, channel_id: channelId, message })
      .select();

    if (error) throw error;
    logger.info(`Set ${type} message for guild ${guildId}`);
    return data[0];
  } catch (error) {
    logger.error(`Error setting ${type} message for guild ${guildId}:`, error);
    throw error;
  }
}

export async function getCustomMessage(guildId, type) {
  try {
    if (!guildId || !type) {
      throw new Error('Missing required parameters');
    }

    const { data, error } = await supabase
      .from('custom_messages')
      .select('channel_id, message')
      .eq('guild_id', guildId)
      .eq('type', type)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    logger.info(`Retrieved ${type} message for guild ${guildId}`);
    return data ? { channelId: data.channel_id, message: data.message } : null;
  } catch (error) {
    logger.error(`Error getting ${type} message for guild ${guildId}:`, error);
    throw error;
  }
}

