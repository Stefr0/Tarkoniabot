import { ChannelType, PermissionFlagsBits, PermissionsBitField } from 'discord.js';

export async function createRoles(guild) {
  const roles = {
    admin: await guild.roles.create({ name: '👑 Admin', color: 'RED', permissions: [PermissionFlagsBits.Administrator] }),
    moderator: await guild.roles.create({ name: '🛡️ Moderator', color: 'BLUE', permissions: [PermissionFlagsBits.ManageMessages, PermissionFlagsBits.KickMembers, PermissionFlagsBits.BanMembers] }),
    member: await guild.roles.create({ name: '🌟 Member', color: 'GREEN' }),
    guest: await guild.roles.create({ name: '👋 Guest', color: 'GREY' }),
    eventOrganizer: await guild.roles.create({ name: '📅 Event Organizer', color: 'PURPLE' }),
    gameStrategist: await guild.roles.create({ name: '🧠 Game Strategist', color: 'ORANGE' }),
    contentCreator: await guild.roles.create({ name: '🎥 Content Creator', color: 'YELLOW' }),
    communityHelper: await guild.roles.create({ name: '🤝 Community Helper', color: 'AQUA' }),
    vip: await guild.roles.create({ name: '✨ VIP', color: 'GOLD' }),
    analyst: await guild.roles.create({ name: '📊 Analyst', color: 'DARK_BLUE' }),
  };

  console.log("Roles created successfully!");
  return roles;
}

export async function createChannels(guild, roles) {
  const categories = {
    info: await guild.channels.create({ name: '📘┃Information', type: ChannelType.GuildCategory }),
    general: await guild.channels.create({ name: '💬┃General', type: ChannelType.GuildCategory }),
    leaderboards: await guild.channels.create({ name: '🏆┃Leaderboards', type: ChannelType.GuildCategory }),
    discussions: await guild.channels.create({ name: '🎮┃Discussions', type: ChannelType.GuildCategory }),
    support: await guild.channels.create({ name: '❓┃Support', type: ChannelType.GuildCategory }),
    voice: await guild.channels.create({ name: '🔊┃Voice Channels', type: ChannelType.GuildCategory }),
  };

  const channels = {
    welcome: await guild.channels.create({ name: '👋┃welcome', type: ChannelType.GuildText, parent: categories.info }),
    rules: await guild.channels.create({ name: '📜┃rules', type: ChannelType.GuildText, parent: categories.info }),
    announcements: await guild.channels.create({ name: '📢┃announcements', type: ChannelType.GuildText, parent: categories.info }),
    botLogs: await guild.channels.create({ name: '🤖┃bot-logs', type: ChannelType.GuildText, parent: categories.info }),
    general: await guild.channels.create({ name: '💬┃general', type: ChannelType.GuildText, parent: categories.general }),
    offTopic: await guild.channels.create({ name: '🎲┃off-topic', type: ChannelType.GuildText, parent: categories.general }),
    memberLeaderboard: await guild.channels.create({ name: '🏅┃member-leaderboard', type: ChannelType.GuildText, parent: categories.leaderboards }),
    clips: await guild.channels.create({ name: '🎬┃clips', type: ChannelType.GuildText, parent: categories.general }),
    suggestions: await guild.channels.create({ name: '💡┃suggestions', type: ChannelType.GuildText, parent: categories.support }),
    generalVoice: await guild.channels.create({ name: '🔊┃General Voice', type: ChannelType.GuildVoice, parent: categories.voice }),
    squad1: await guild.channels.create({ name: '🎮┃Squad 1', type: ChannelType.GuildVoice, parent: categories.voice }),
    squad2: await guild.channels.create({ name: '🎮┃Squad 2', type: ChannelType.GuildVoice, parent: categories.voice }),
  };

  console.log("Channels and categories created successfully!");
  return { channels, categories };
}

// Reaction-based Role Picker
export async function setupRolePicker(guild, roles, botLogsChannel) {
  const roleChannel = await guild.channels.create({
    name: '🎭┃role-picker',
    type: ChannelType.GuildText,
    topic: 'React to this message to pick your roles!',
  });

  const roleMessage = await roleChannel.send(`
🌟 **React below to pick your roles!**
📅 - Event Organizer
🧠 - Game Strategist
🎥 - Content Creator
🤝 - Community Helper
✨ - VIP
`);

  await roleMessage.react('📅'); // Event Organizer
  await roleMessage.react('🧠'); // Game Strategist
  await roleMessage.react('🎥'); // Content Creator
  await roleMessage.react('🤝'); // Community Helper
  await roleMessage.react('✨'); // VIP

  const collector = roleMessage.createReactionCollector({ dispose: true });

  collector.on('collect', async (reaction, user) => {
    const member = await guild.members.fetch(user.id);
    switch (reaction.emoji.name) {
      case '📅': member.roles.add(roles.eventOrganizer); break;
      case '🧠': member.roles.add(roles.gameStrategist); break;
      case '🎥': member.roles.add(roles.contentCreator); break;
      case '🤝': member.roles.add(roles.communityHelper); break;
      case '✨': member.roles.add(roles.vip); break;
    }
    botLogsChannel.send(`✅ ${user.tag} was given a role via role picker.`);
  });

  console.log("Role picker setup completed!");
}

// Audit Log Functionality
export async function logAudit(guild, botLogsChannel) {
  guild.on('roleCreate', (role) => botLogsChannel.send(`🆕 Role Created: **${role.name}**`));
  guild.on('roleDelete', (role) => botLogsChannel.send(`❌ Role Deleted: **${role.name}**`));
  guild.on('channelCreate', (channel) => botLogsChannel.send(`🆕 Channel Created: **${channel.name}**`));
  guild.on('channelDelete', (channel) => botLogsChannel.send(`❌ Channel Deleted: **${channel.name}**`));
  console.log("Audit logging active.");
}

