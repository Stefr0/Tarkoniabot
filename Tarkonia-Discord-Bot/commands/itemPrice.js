import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { searchItem } from '../utils/tarkovApi.js';

export const data = new SlashCommandBuilder()
  .setName('itemprice')
  .setDescription('Get the price of a Tarkov item')
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
      .setDescription(`Current market price: ${item.price} ₽`)
      .addFields(
        { name: 'Base Price', value: `${item.basePrice} ₽`, inline: true },
        { name: 'Trader Price', value: `${item.traderPrice} ₽`, inline: true }
      );

    await interaction.editReply({ embeds: [embed] });
  } catch (error) {
    console.error(error);
    await interaction.editReply('There was an error while searching for the item price.');
  }
}

