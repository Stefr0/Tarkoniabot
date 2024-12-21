import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { searchItem } from '../utils/tarkovApi.js';

export const data = new SlashCommandBuilder()
  .setName('tarkovitem')
  .setDescription('Search for a Tarkov item')
  .addStringOption(option => 
    option.setName('name')
      .setDescription('The name of the item to search for')
      .setRequired(true));

export async function execute(interaction) {
  const itemName = interaction.options.getString('name');
  
  await interaction.deferReply();

  try {
    const items = await searchItem(itemName);
    
    if (items.length === 0) {
      await interaction.editReply('No items found with that name.');
      return;
    }

    const item = items[0]; // Get the first (most relevant) item

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle(item.name)
      .setDescription(item.description)
      .addFields(
        { name: 'Short Name', value: item.shortName, inline: true },
        { name: 'Base Price', value: `${item.basePrice} ₽`, inline: true },
        { name: 'Weight', value: `${item.weight} kg`, inline: true },
        { name: 'Size', value: `${item.width}x${item.height}`, inline: true }
      );

    await interaction.editReply({ embeds: [embed] });
  } catch (error) {
    console.error(error);
    await interaction.editReply('There was an error while searching for the item.');
  }
}

