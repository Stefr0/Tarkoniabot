import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { performanceMonitor } from '../utils/performanceMonitor.js';
import logger from '../utils/logger.js';

export const data = new SlashCommandBuilder()
  .setName('performance')
  .setDescription('View bot performance metrics')
  .addSubcommand(subcommand =>
    subcommand
      .setName('view')
      .setDescription('View current performance metrics'))
  .addSubcommand(subcommand =>
    subcommand
      .setName('clear')
      .setDescription('Clear current performance metrics'))
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction) {
  const subcommand = interaction.options.getSubcommand();

  try {
    if (subcommand === 'view') {
      const metrics = performanceMonitor.getMetrics();
      
      if (metrics.length === 0) {
        await interaction.reply('No performance metrics available.');
        return;
      }

      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Bot Performance Metrics')
        .setDescription('Average and maximum execution times for various operations')
        .addFields(
          metrics.map(metric => ({
            name: metric.operation,
            value: `Count: ${metric.count}\nAvg: ${metric.avgTime}ms\nMax: ${metric.maxTime}ms`,
            inline: true
          }))
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
      logger.info(`Performance metrics viewed in guild ${interaction.guild.id}`);
    } else if (subcommand === 'clear') {
      performanceMonitor.clearMetrics();
      await interaction.reply('Performance metrics have been cleared.');
      logger.info(`Performance metrics cleared in guild ${interaction.guild.id}`);
    }
  } catch (error) {
    logger.error(`Error handling performance command in guild ${interaction.guild.id}:`, error);
    await interaction.reply({ content: 'An error occurred while processing the performance command.', ephemeral: true });
  }
}

