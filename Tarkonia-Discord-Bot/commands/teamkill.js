import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { logTeamKill } from '../utils/supabase.js';

export const data = new SlashCommandBuilder()
  .setName('teamkill')
  .setDescription('Log a team kill')
  .addUserOption(option => option.setName('killer').setDescription('The user who committed the team kill').setRequired(true))
  .addUserOption(option => option.setName('victim').setDescription('The user who was team killed').setRequired(true));

export async function execute(interaction) {
  const killer = interaction.options.getUser('killer');
  const victim = interaction.options.getUser('victim');
  
  try {
    await logTeamKill(killer.id, victim.id);
    await interaction.reply(`Team kill logged: ${killer.username} killed ${victim.username}`);
  } catch (error) {
    console.error('Error logging team kill:', error);
    await interaction.reply('There was an error logging the team kill.');
  }
}

