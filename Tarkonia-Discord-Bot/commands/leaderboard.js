import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getLeaderboard } from '../utils/xpSystem.js';

export const data = new SlashCommandBuilder()
  .setName('leaderboard')
  .setDescription('View the XP leaderboard');

export async function execute(interaction) {
  const leaderboard = getLeaderboard();
  
  const embed = new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle('XP Leaderboard')
    .setDescription(
      leaderboard.map(([userId, data], index) => 
        `${index + 1}. <@${userId}>: Level ${data.level} (${data.xp} XP)`
      ).join('\n')
    );

  await interaction.reply({ embeds: [embed] });
}

