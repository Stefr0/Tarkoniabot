import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getTeamKillLeaderboard } from '../utils/supabase.js';

export const data = new SlashCommandBuilder()
  .setName('teamkillleaderboard')
  .setDescription('Show the team kill leaderboard');

export async function execute(interaction) {
  try {
    const leaderboardData = await getTeamKillLeaderboard();

    const leaderboardPromises = leaderboardData.map(async (entry) => {
      const user = await interaction.client.users.fetch(entry.killer_id);
      return `${user.username}: ${entry.count} team kills`;
    });

    const leaderboard = await Promise.all(leaderboardPromises);

    const embed = new EmbedBuilder()
      .setColor('#FF4136')
      .setTitle('Team Kill Leaderboard')
      .setDescription(leaderboard.join('\n'));

    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    console.error('Error fetching team kill leaderboard:', error);
    await interaction.reply('There was an error fetching the team kill leaderboard.');
  }
}

