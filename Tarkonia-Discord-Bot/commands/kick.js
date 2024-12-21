import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('kick')
  .setDescription('Kick a user from the server')
  .addUserOption(option => option.setName('target').setDescription('The user to kick').setRequired(true))
  .addStringOption(option => option.setName('reason').setDescription('The reason for kicking'))
  .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers);

export async function execute(interaction) {
  const target = interaction.options.getUser('target');
  const reason = interaction.options.getString('reason') ?? 'No reason provided';

  try {
    await interaction.guild.members.kick(target, reason);
    await interaction.reply(`Successfully kicked ${target.tag} for reason: ${reason}`);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while kicking the user!', ephemeral: true });
  }
}

