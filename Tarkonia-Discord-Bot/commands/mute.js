import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('mute')
  .setDescription('Mute a user in the server')
  .addUserOption(option => option.setName('target').setDescription('The user to mute').setRequired(true))
  .addIntegerOption(option => option.setName('duration').setDescription('Mute duration in minutes').setRequired(true))
  .addStringOption(option => option.setName('reason').setDescription('The reason for muting'))
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers);

export async function execute(interaction) {
  const target = interaction.options.getMember('target');
  const duration = interaction.options.getInteger('duration');
  const reason = interaction.options.getString('reason') ?? 'No reason provided';

  if (!target.moderatable) {
    return interaction.reply({ content: 'I cannot mute this user!', ephemeral: true });
  }

  try {
    await target.timeout(duration * 60 * 1000, reason);
    await interaction.reply(`Successfully muted ${target.user.tag} for ${duration} minutes. Reason: ${reason}`);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while muting the user!', ephemeral: true });
  }
}

