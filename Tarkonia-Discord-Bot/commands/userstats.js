import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getUserStats } from '../utils/supabase.js';

export const data = new SlashCommandBuilder()
  .setName('userstats')
  .setDescription('View your Tarkov stats')
  .addUserOption(option => option.setName('user').setDescription('The user to view stats for (defaults to yourself)'));

export async function execute(interaction) {
  const user = interaction.options.getUser('user') || interaction.user;
  
  try {
    const stats = await getUserStats(user.id);
    
    if (!stats) {
      await interaction.reply(`No stats found for ${user.username}.`);
      return;
    }

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle(`${user.username}'s Tarkov Stats`)
      .addFields(
        { name: 'Raids', value: stats.raids.toString(), inline: true },
        { name: 'Survival Rate', value: `${stats.survival_rate}%`, inline: true },
        { name: 'K/D Ratio', value: stats.kd_ratio.toFixed(2), inline: true },
        { name: 'Average Loot Value', value: `${stats.avg_loot_value.toFixed(2)} ₽`, inline: true },
        { name: 'Favorite Weapon', value: stats.favorite_weapon, inline: true },
        { name: 'Quests Completed', value: stats.quests_completed.toString(), inline: true }
      );

    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    await interaction.reply('There was an error fetching the user stats.');
  }
}

