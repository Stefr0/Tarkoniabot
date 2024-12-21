import { Events } from 'discord.js';
import { getCustomMessage } from '../utils/messageManager.js';
import logger from '../utils/logger.js';

export const name = Events.GuildMemberRemove;

export async function execute(member) {
  try {
    const goodbyeMessage = await getCustomMessage(member.guild.id, 'goodbye');
    if (!goodbyeMessage) {
      logger.info(`No goodbye message set for guild ${member.guild.id}`);
      return;
    }

    const channelId = goodbyeMessage.channelId;
    const message = goodbyeMessage.message.replace('{user}', member.user.toString());

    const channel = member.guild.channels.cache.get(channelId);
    if (!channel) {
      throw new Error(`Goodbye channel ${channelId} not found in guild ${member.guild.id}`);
    }

    await channel.send(message);
    logger.info(`Sent goodbye message for ${member.user.tag} in guild ${member.guild.id}`);
  } catch (error) {
    logger.error(`Error sending goodbye message in guild ${member.guild.id}:`, error);
  }
}

