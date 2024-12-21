import { Client, GatewayIntentBits, Collection, EmbedBuilder } from 'discord.js';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import { fetchLatestNews } from './utils/newsAggregator.js';
import { rateLimitCheck } from './utils/rateLimiter.js';
import { applyCooldown } from './utils/cooldown.js';
import { checkPermissions } from './utils/permissions.js';
import { performanceMonitor } from './utils/performanceMonitor.js';
import { getPersonalityResponse } from './utils/personalityResponses.js';
import logger from './utils/logger.js';
import { getBotConfig, updateBotStatus } from './utils/botConfig.js';

// Load environment variables
config();

// Ensure required environment variables are set
const requiredEnvVars = ['DISCORD_TOKEN', 'SUPABASE_URL', 'SUPABASE_ANON_KEY', 'GOOGLE_GEMINI_API'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
  ],
});

// Create collections for commands and cooldowns
client.commands = new Collection();
client.cooldowns = new Collection();

// Supabase client initialization
let supabase;
try {
  supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
  client.supabase = supabase;
  console.log('Supabase client initialized successfully');
} catch (error) {
  console.error('Error initializing Supabase client:', error);
}

// Command handler
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  import(filePath).then((command) => {
    if ('data' in command && 'execute' in command) {
      // Slash command
      client.commands.set(command.data.name, command);
      console.log(`Loaded slash command: ${command.data.name}`);
    } else if ('name' in command && 'execute' in command) {
      // Traditional command
      client.commands.set(command.name, command);
      console.log(`Loaded traditional command: ${command.name}`);
    } else {
      console.warn(`[WARNING] The command at ${filePath} is missing a required "data" or "name" property.`);
    }
  }).catch((error) => {
    console.error(`Error loading command file ${filePath}:`, error);
  });
}

// Slash command handler with rate limiting, cooldown, and permissions
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    logger.warn(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    // Check permissions
    if (!checkPermissions(interaction.member, command)) {
      await interaction.reply({ content: "Nice try, rookie. You don't have permission to use this command.", ephemeral: true });
      return;
    }

    // Check rate limit
    if (rateLimitCheck(interaction.user.id)) {
      await interaction.reply({ content: "Whoa there, speed demon! You're using commands faster than a max strength PMC. Slow down!", ephemeral: true });
      return;
    }

    // Check cooldown
    const cooldownTime = applyCooldown(command, interaction.user.id);
    if (cooldownTime) {
      await interaction.reply({ content: `Command's on cooldown, just like your skills after a raid. Wait ${cooldownTime} more second(s) before reusing the \`${command.name}\` command.`, ephemeral: true });
      return;
    }

    const startTime = performanceMonitor.startTimer(interaction.commandName);
    await command.execute(interaction);
    performanceMonitor.endTimer(interaction.commandName, startTime);

    logger.info(`Command ${interaction.commandName} executed successfully in guild ${interaction.guild.id}`);
  } catch (error) {
    logger.error(`Error executing command ${interaction.commandName} in guild ${interaction.guild.id}:`, error);
    const errorMessage = getPersonalityResponse('sarcastic') + " There was an error while executing this command!";
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: errorMessage, ephemeral: true });
    } else {
      await interaction.reply({ content: errorMessage, ephemeral: true });
    }
  }
});

// Prefix command handler with rate limiting, cooldown, and permissions
const prefix = '!';
client.on('messageCreate', async message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);

  if (!command) return;

  try {
    // Check permissions
    if (!checkPermissions(message.member, command)) {
      await message.reply("You don't have permission to use this command.");
      return;
    }

    // Check rate limit
    if (rateLimitCheck(message.author.id)) {
      await message.reply("You're using commands too quickly! Please wait a moment before trying again.");
      return;
    }

    // Check cooldown
    const cooldownTime = applyCooldown(command, message.author.id);
    if (cooldownTime) {
      await message.reply(`Please wait ${cooldownTime} more second(s) before reusing the \`${command.name}\` command.`);
      return;
    }

    console.log(`Executing prefix command: ${commandName}`);
    await command.execute(message, args);
    console.log(`Prefix command executed successfully: ${commandName}`);
  } catch (error) {
    console.error(`Error executing prefix command ${commandName}:`, error);
    await message.reply('There was an error executing that command!');
  }
});

// Event handler
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  import(filePath).then((event) => {
    if (event.once) {
      client.once(event.name, (...args) => {
        console.log(`Executing event: ${event.name} (once)`);
        event.execute(...args);
      });
    } else {
      client.on(event.name, (...args) => {
        console.log(`Executing event: ${event.name}`);
        event.execute(...args);
      });
    }
    console.log(`Loaded event: ${event.name}`);
  }).catch((error) => {
    console.error(`Error loading event file ${filePath}:`, error);
  });
}

// Set up a scheduled task to fetch and post news updates
const newsInterval = setInterval(async () => {
  try {
    console.log('Fetching latest news...');
    const newsItems = await fetchLatestNews();
    if (newsItems.length > 0) {
      const latestNews = newsItems[0];
      const newsChannel = await client.channels.fetch(process.env.NEWS_CHANNEL_ID);
      
      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Latest Escape from Tarkov News')
        .setDescription(`${latestNews.title}\n\n[Read more](${latestNews.link})`)
        .setFooter({ text: `Source: ${latestNews.source}` })
        .setTimestamp(latestNews.pubDate);

      await newsChannel.send({ embeds: [embed] });
      console.log('News update posted successfully');
    } else {
      console.log('No new news items to post');
    }
  } catch (error) {
    console.error('Error posting news update:', error);
  }
}, 3600000); // Check for news every hour

// Error handling for unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
});

// Error handling for Discord client errors
client.on('error', (error) => {
  console.error('Discord client error:', error);
});

// Graceful shutdown
async function shutdownBot(userId) {
  try {
    const botConfig = await getBotConfig(userId);
    if (botConfig) {
      await updateBotStatus(botConfig.id, false);
    }
    client.destroy();
  } catch (error) {
    console.error('Error shutting down bot:', error);
  }
}

process.on('SIGINT', async () => {
  console.log('Received SIGINT. Shutting down gracefully...');
  clearInterval(newsInterval);
  await shutdownBot(userId);
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Received SIGTERM. Shutting down gracefully...');
  clearInterval(newsInterval);
  await shutdownBot(userId);
  process.exit(0);
});

async function startBot(userId) {
  try {
    const botConfig = await getBotConfig(userId);
    if (!botConfig) {
      throw new Error('Bot configuration not found');
    }

    await client.login(botConfig.bot_token);
    await updateBotStatus(botConfig.id, true);
    console.log('Bot logged in successfully');
  } catch (error) {
    console.error('Error starting bot:', error);
    process.exit(1);
  }
}

const userId = process.env.USER_ID; // You'll need to set this in your .env file
startBot(userId);

