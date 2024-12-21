import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { fetchLatestNews } from '../utils/newsAggregator.js';

export const data = new SlashCommandBuilder()
  .setName('latestnews')
  .setDescription('Get the latest Escape from Tarkov news');

export async function execute(interaction) {
  await interaction.deferReply();

  try {
    const newsItems = await fetchLatestNews();

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('Latest Escape from Tarkov News')
      .setDescription('Here are the most recent news items:')
      .setTimestamp();

    newsItems.forEach((item, index) => {
      if (index < 5) { // Limit to 5 items in the embed due to Discord's limits
        embed.addFields({ name: item.title, value: `[Read more](${item.link}) (${item.source})` });
      }
    });

    await interaction.editReply({ embeds: [embed] });
  } catch (error) {
    console.error('Error fetching latest news:', error);
    await interaction.editReply('There was an error fetching the latest news. Please try again later.');
  }
}

