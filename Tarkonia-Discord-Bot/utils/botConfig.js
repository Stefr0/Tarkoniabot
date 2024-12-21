import { createClient } from '@supabase/supabase-js';
import logger from './logger.js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

export async function createBotConfig(userId, botToken) {
  try {
    const { data, error } = await supabase
      .from('discord_bots')
      .insert([
        { user_id: userId, bot_token: botToken }
      ])
      .select();

    if (error) throw error;
    logger.info(`Bot configuration created for user ${userId}`);
    return data[0];
  } catch (error) {
    logger.error(`Error creating bot configuration: ${error.message}`);
    throw error;
  }
}

export async function getBotConfig(userId) {
  try {
    const { data, error } = await supabase
      .from('discord_bots')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  } catch (error) {
    logger.error(`Error fetching bot configuration: ${error.message}`);
    throw error;
  }
}

export async function updateBotStatus(id, isRunning) {
  try {
    const { data, error } = await supabase
      .from('discord_bots')
      .update({ is_running: isRunning, updated_at: new Date() })
      .eq('id', id)
      .select();

    if (error) throw error;
    logger.info(`Bot status updated for bot ${id}: ${isRunning ? 'running' : 'stopped'}`);
    return data[0];
  } catch (error) {
    logger.error(`Error updating bot status: ${error.message}`);
    throw error;
  }
}

export async function deleteBotConfig(id) {
  try {
    const { error } = await supabase
      .from('discord_bots')
      .delete()
      .eq('id', id);

    if (error) throw error;
    logger.info(`Bot configuration deleted for bot ${id}`);
  } catch (error) {
    logger.error(`Error deleting bot configuration: ${error.message}`);
    throw error;
  }
}

