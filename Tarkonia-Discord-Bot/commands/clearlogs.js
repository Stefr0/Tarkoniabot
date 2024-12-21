import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { clearLogs } from '../utils/logger.js';

export const data = new SlashCommandBuilder()
  .setName('clearlogs')
  .setDescription('Clear bot logs')
  .addStringOption(option =>
    option.setName('type')
      .setDescription('The type of logs to clear')
      .setRequired(true)
      .addChoices(
        { name: 'Combined', value: 'combined' },
        { name: 'Error', value: 'error' },
        { name: 'All', value: 'all' }
      ))
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction) {
  const logType = interaction.options.getString('type');

  try {
    if (logType === 'all') {
      clearLogs('combined');
      clearLogs('error');
      await interaction.reply('All logs have been cleared.');
    } else {
      clearLogs(logType);
      await interaction.reply(`${logType.charAt(0).toUpperCase() + logType.slice(1)} logs have been cleared.`);
    }
  } catch (error) {
    console.error('Error clearing logs:', error);
    await interaction.reply('An error occurred while clearing the logs.');
  }
}

