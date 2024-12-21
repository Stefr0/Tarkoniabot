import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('ban')
  .setDescription('Ban a user from the server')
  .addUserOption(option => option.setName('target').setDescription('The user to ban').setRequired(true))
  .addStringOption(option => option.setName('reason').setDescription('The reason for banning'))
  .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers);

export async function execute(interaction) {
  const target = interaction.options.getUser('target');
  const reason = interaction.options.getString('reason') ?? 'No reason provided';

  try {
    await interaction.guild.members.ban(target, { reason });
    await interaction.reply(`Successfully banned ${target.tag} for reason: ${reason}`);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while banning the user!', ephemeral: true });
  }
}

