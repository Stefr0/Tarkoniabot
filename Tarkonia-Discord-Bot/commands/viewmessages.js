import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { getCustomMessage } from '../utils/messageManager.js';
import logger from '../utils/logger.js';

export const data = new SlashCommandBuilder()
  .setName('viewmessages')
  .setDescription('View current welcome and goodbye messages')
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export async function execute(interaction) {
  try {
    const welcomeMessage = await getCustomMessage(interaction.guild.id, 'welcome');
    const goodbyeMessage = await getCustomMessage(interaction.guild.id, 'goodbye');

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('Custom Messages')
      .addFields(
        { name: 'Welcome Message', value: welcomeMessage ? `Channel: <#${welcomeMessage.channelId}>\nMessage: ${welcomeMessage.message}` : 'Not set' },
        { name: 'Goodbye Message', value: goodbyeMessage ? `Channel: <#${goodbyeMessage.channelId}>\nMessage: ${goodbyeMessage.message}` : 'Not set' }
      );

    await interaction.reply({ embeds: [embed] });
    logger.info(`Viewed messages in guild ${interaction.guild.id}`);
  } catch (error) {
    logger.error(`Error viewing messages in guild ${interaction.guild.id}:`, error);
    await interaction.reply({ content: 'An error occurred while retrieving the messages. Please try again later.', ephemeral: true });
  }
}

