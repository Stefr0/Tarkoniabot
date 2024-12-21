import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { getLogs } from '../utils/logger.js';

export const data = new SlashCommandBuilder()
  .setName('getlogs')
  .setDescription('Retrieve bot logs')
  .addStringOption(option =>
    option.setName('type')
      .setDescription('The type of logs to retrieve')
      .setRequired(true)
      .addChoices(
        { name: 'Combined', value: 'combined' },
        { name: 'Error', value: 'error' }
      ))
  .addIntegerOption(option =>
    option.setName('lines')
      .setDescription('Number of log lines to retrieve (default: 50, max: 100)')
      .setRequired(false))
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction) {
  const logType = interaction.options.getString('type');
  const lines = Math.min(interaction.options.getInteger('lines') || 50, 100);

  try {
    const logs = getLogs(logType, lines);
    if (logs.length === 0) {
      await interaction.reply('No logs found.');
    } else {
      // Split logs into chunks of 1900 characters to fit within Discord's message limit
      const chunks = logs.match(/.{1,1900}/g) || [];
      await interaction.reply(`Here are the last ${lines} lines of the ${logType} logs:`);
      for (const chunk of chunks) {
        await interaction.followUp(`\`\`\`\n${chunk}\n\`\`\``);
      }
    }
  } catch (error) {
    console.error('Error retrieving logs:', error);
    await interaction.reply('An error occurred while retrieving the logs.');
  }
}

