import { ChannelType, PermissionFlagsBits } from 'discord.js';
import { initializeServerConfig } from '../utils/supabase.js';
import { createChannels, createRoles } from '../utils/serverSetup.js';

export const name = 'setup';
export const description = 'Initialize the server for Tarkonia bot usage';

export async function execute(message, args) {
  try {
    // Check if the user has administrator permissions
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return message.reply('❌ You need to be an administrator to use this command.');
    }

    // Defer the response to show progress
    await message.reply('🛠️ **Starting server setup...** This may take a few moments.');

    const guild = message.guild;

    // Validate that the guild object exists
    if (!guild) {
      return message.reply('❌ Server setup failed. Could not access the guild information.');
    }

    // Create roles and channels
    const roles = await createRoles(guild);
    const { channels } = await createChannels(guild, roles);

    // Validate essential channels and roles
    if (!channels || !roles) {
      return message.reply('❌ Server setup failed. Some roles or channels could not be created.');
    }

    // Initialize server configuration in the database
    await initializeServerConfig(guild.id, {
      welcomeChannelId: channels.welcome?.id || null,
      rulesChannelId: channels.rules?.id || null,
      announcementsChannelId: channels.announcements?.id || null,
      logsChannelId: channels.botLogs?.id || null,
      generalChannelId: channels.general?.id || null,
      supportChannelId: channels.support?.id || null,
      memberLeaderboardChannelId: channels.memberLeaderboard?.id || null,
      adminRoleId: roles.admin?.id || null,
      moderatorRoleId: roles.moderator?.id || null,
      memberRoleId: roles.member?.id || null,
    });

    await message.reply('✅ **Server setup completed successfully!** Tarkonia bot is ready to use.');
    console.log('Server setup completed successfully!');
  } catch (error) {
    console.error('❌ Error during server setup:', error);

    // Handle specific errors with user-friendly messages
    if (error.code === 50013) {
      return message.reply('❌ I lack the necessary permissions to perform server setup. Please check my role.');
    }

    await message.reply(
      '⚠️ **An unexpected error occurred during server setup.** Please check logs or contact support.'
    );
  }
}

