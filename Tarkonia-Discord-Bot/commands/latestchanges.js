import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getLatestChanges } from '../utils/tarkovApi.js';

export const data = new SlashCommandBuilder()
  .setName('latestchanges')
  .setDescription('Get the latest changes in Escape from Tarkov');

export async function execute(interaction) {
  await interaction.deferReply();

  try {
    const changes = await getLatestChanges();

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('Latest Escape from Tarkov Changes')
      .setDescription(changes.slice(0, 5).map(change => `• ${change}`).join('\n'))
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  } catch (error) {
    console.error(error);
    await interaction.editReply('There was an error fetching the latest changes.');
  }
}

