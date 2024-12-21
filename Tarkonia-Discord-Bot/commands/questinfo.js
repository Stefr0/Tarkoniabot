import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getQuests } from '../utils/tarkovApi.js';

export const data = new SlashCommandBuilder()
  .setName('questinfo')
  .setDescription('Get information about a Tarkov quest')
  .addStringOption(option => 
    option.setName('name')
      .setDescription('The name of the quest')
      .setRequired(true));

export async function execute(interaction) {
  const questName = interaction.options.getString('name');
  
  await interaction.deferReply();

  try {
    const quests = await getQuests(questName);
    
    if (quests.length === 0) {
      await interaction.editReply('No quest found with that name.');
      return;
    }

    const quest = quests[0]; // Get the first (most relevant) quest

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle(quest.name)
      .addFields(
        { name: 'Trader', value: quest.trader.name, inline: true },
        { name: 'Map', value: quest.map.name, inline: true },
        { name: 'Experience', value: quest.experience.toString(), inline: true },
        { name: 'Objectives', value: quest.objectives.map(obj => obj.description).join('\n') }
      );

    await interaction.editReply({ embeds: [embed] });
  } catch (error) {
    console.error(error);
    await interaction.editReply('There was an error while fetching the quest information.');
  }
}

