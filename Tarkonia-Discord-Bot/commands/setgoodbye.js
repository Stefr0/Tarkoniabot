import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { setCustomMessage } from '../utils/messageManager.js';
import logger from '../utils/logger.js';

export const data = new SlashCommandBuilder()
  .setName('setgoodbye')
  .setDescription('Set a custom goodbye message')
  .addChannelOption(option =>
    option.setName('channel')
      .setDescription('The channel to send goodbye messages')
      .setRequired(true))
  .addStringOption(option =>
    option.setName('message')
      .setDescription('The goodbye message (use {user} to mention the leaving member)')
      .setRequired(true))
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export async function execute(interaction) {
  const channel = interaction.options.getChannel('channel');
  const message = interaction.options.getString('message');

  if (!channel.isTextBased()) {
    await interaction.reply({ content: 'The specified channel must be a text channel.', ephemeral: true });
    return;
  }

  if (message.length > 1000) {
    await interaction.reply({ content: 'The goodbye message must be 1000 characters or less.', ephemeral: true });
    return;
  }

  try {
    await setCustomMessage(interaction.guild.id, 'goodbye', channel.id, message);
    await interaction.reply(`Goodbye message set for ${channel}:\n${message}`);
    logger.info(`Set goodbye message in guild ${interaction.guild.id}`);
  } catch (error) {
    logger.error(`Error setting goodbye message in guild ${interaction.guild.id}:`, error);
    await interaction.reply({ content: 'An error occurred while setting the goodbye message. Please try again later.', ephemeral: true });
  }
}

