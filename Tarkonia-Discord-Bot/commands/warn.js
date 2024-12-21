import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('warn')
  .setDescription('Warn a user in the server')
  .addUserOption(option => option.setName('target').setDescription('The user to warn').setRequired(true))
  .addStringOption(option => option.setName('reason').setDescription('The reason for warning').setRequired(true))
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers);

export async function execute(interaction) {
  const target = interaction.options.getUser('target');
  const reason = interaction.options.getString('reason');

  // In a real implementation, you'd store this warning in a database
  await interaction.reply(`${target.tag} has been warned for: ${reason}`);
  
  try {
    await target.send(`You have been warned in ${interaction.guild.name} for: ${reason}`);
  } catch (error) {
    await interaction.followUp({ content: 'Warning sent, but unable to DM the user.', ephemeral: true });
  }
}

