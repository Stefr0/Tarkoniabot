import { Events } from 'discord.js';
import { getCustomMessage } from '../utils/messageManager.js';
import logger from '../utils/logger.js';

export const name = Events.GuildMemberAdd;

export async function execute(member) {
  try {
    const welcomeMessage = await getCustomMessage(member.guild.id, 'welcome');
    if (!welcomeMessage) {
      logger.info(`No welcome message set for guild ${member.guild.id}`);
      return;
    }

    const channelId = welcomeMessage.channelId;
    const message = welcomeMessage.message.replace('{user}', member.user.toString());

    const channel = member.guild.channels.cache.get(channelId);
    if (!channel) {
      throw new Error(`Welcome channel ${channelId} not found in guild ${member.guild.id}`);
    }

    await channel.send(message);
    logger.info(`Sent welcome message for ${member.user.tag} in guild ${member.guild.id}`);
  } catch (error) {
    logger.error(`Error sending welcome message in guild ${member.guild.id}:`, error);
  }
}

