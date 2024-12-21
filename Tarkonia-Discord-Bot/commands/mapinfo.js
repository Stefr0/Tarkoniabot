import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getMapInfo } from '../utils/tarkovApi.js';

export const data = new SlashCommandBuilder()
  .setName('mapinfo')
  .setDescription('Get information about a Tarkov map')
  .addStringOption(option => 
    option.setName('name')
      .setDescription('The name of the map')
      .setRequired(true));

export async function execute(interaction) {
  const mapName = interaction.options.getString('name');
  
  await interaction.deferReply();

  try {
    const mapInfo = await getMapInfo(mapName);
    
    if (!mapInfo) {
      await interaction.editReply('No map found with that name.');
      return;
    }

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle(mapInfo.name)
      .setDescription(mapInfo.description)
      .addFields(
        { name: 'Raid Duration', value: `${mapInfo.raidDuration} minutes`, inline: true },
        { name: 'Player Count', value: mapInfo.players, inline: true },
        { name: 'Bosses', value: mapInfo.bosses.map(boss => `${boss.name} (${boss.spawnChance}% chance)`).join('\n') || 'None' }
      );

    await interaction.editReply({ embeds: [embed] });
  } catch (error) {
    console.error(error);
    await interaction.editReply('There was an error while fetching the map information.');
  }
}

