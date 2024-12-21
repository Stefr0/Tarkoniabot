import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getServerStatus } from '../utils/tarkovApi.js';

export const data = new SlashCommandBuilder()
  .setName('serverstatus')
  .setDescription('Get the current Escape from Tarkov server status');

export async function execute(interaction) {
  await interaction.deferReply();

  try {
    const status = await getServerStatus();

    const embed = new EmbedBuilder()
      .setColor(status.online ? '#00FF00' : '#FF0000')
      .setTitle('Escape from Tarkov Server Status')
      .setDescription(status.online ? 'Servers are online' : 'Servers are offline')
      .addFields(
        { name: 'Player Count', value: status.playerCount.toString(), inline: true },
        { name: 'Queue Time', value: `${status.queueTime} minutes`, inline: true }
      )
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  } catch (error) {
    console.error(error);
    await interaction.editReply('There was an error fetching the server status.');
  }
}

