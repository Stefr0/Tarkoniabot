import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { createBotConfig, deleteBotConfig, getBotConfig } from '../utils/botConfig.js';
import logger from '../utils/logger.js';

export const data = new SlashCommandBuilder()
  .setName('botconfig')
  .setDescription('Manage bot configuration')
  .addSubcommand(subcommand =>
    subcommand
      .setName('create')
      .setDescription('Create a new bot configuration')
      .addStringOption(option =>
        option.setName('token')
          .setDescription('The bot token')
          .setRequired(true)))
  .addSubcommand(subcommand =>
    subcommand
      .setName('delete')
      .setDescription('Delete the bot configuration'))
  .addSubcommand(subcommand =>
    subcommand
      .setName('view')
      .setDescription('View the current bot configuration'))
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction) {
  const subcommand = interaction.options.getSubcommand();

  try {
    switch (subcommand) {
      case 'create':
        const token = interaction.options.getString('token');
        const config = await createBotConfig(interaction.user.id, token);
        await interaction.reply({ content: 'Bot configuration created successfully!', ephemeral: true });
        break;
      case 'delete':
        const existingConfig = await getBotConfig(interaction.user.id);
        if (existingConfig) {
          await deleteBotConfig(existingConfig.id);
          await interaction.reply({ content: 'Bot configuration deleted successfully!', ephemeral: true });
        } else {
          await interaction.reply({ content: 'No bot configuration found to delete.', ephemeral: true });
        }
        break;
      case 'view':
        const currentConfig = await getBotConfig(interaction.user.id);
        if (currentConfig) {
          await interaction.reply({
            content: `Current bot configuration:\nID: ${currentConfig.id}\nStatus: ${currentConfig.is_running ? 'Running' : 'Stopped'}`,
            ephemeral: true
          });
        } else {
          await interaction.reply({ content: 'No bot configuration found.', ephemeral: true });
        }
        break;
    }
  } catch (error) {
    logger.error(`Error in botconfig command: ${error.message}`);
    await interaction.reply({ content: 'An error occurred while managing the bot configuration.', ephemeral: true });
  }
}

