# Tarkonia Discord Bot

Tarkonia is a feature-rich Discord bot designed specifically for Escape from Tarkov communities. It offers a wide range of functionalities including moderation tools, game-specific commands, leaderboards, and server management utilities.

## Features

- Server setup automation
- Moderation commands (kick, ban, mute, warn)
- Game-specific commands (item info, ammo stats, map details)
- Team kill logging and leaderboards
- XP-based ranking system
- Tarkov.dev API integration for item and stat lookups
- Tarkov-Changes API integration for patch notes
- Multi-language support
- Advanced analytics for server activity and bot usage

## New Features

### Tarkov News Aggregator
The bot now automatically fetches and posts the latest news from official Escape from Tarkov sources. Use the `/latestnews` command to get the most recent updates.

### AI-powered Suggestions
Get personalized loadout and strategy suggestions based on your playstyle and in-game statistics. Use the `/aisuggestion` command followed by your preferred playstyle to receive AI-generated advice.
`npm install xml2js openai`

### Rate Limiting and Cooldowns
The bot now implements rate limiting to prevent spam and abuse. Users are limited to 5 commands per 10 seconds. Additionally, individual commands may have cooldowns to further prevent overuse.
`npm install discord-rate-limiter`

### Permission System
Commands can now be restricted to specific roles or permissions. This allows for better control over who can use certain bot features.

## Additional Commands

- `/latestnews`: Fetch and display the latest Escape from Tarkov news
- `/aisuggestion <playstyle>`: Get an AI-powered loadout and strategy suggestion based on your stats and preferred playstyle

## Prerequisites

- Node.js (v16.9.0 or higher)
- npm (Node Package Manager)
- A Discord Bot Token
- A Supabase account and project
- Tarkov.dev API key
- Tarkov-Changes API key

## Detailed Installation Instructions

1. Clone the repository:


## Configuration

To use these new features, add the following to your `.env` file:

\`\`\`
NEWS_CHANNEL_ID=your_news_channel_id
OPENAI_API_KEY=your_openai_api_key
\`\`\`

Make sure to replace `your_news_channel_id` with the ID of the channel where you want news updates to be posted, and `your_openai_api_key` with your OpenAI API key for AI-powered suggestions.

## Additional Dependencies

Install the following additional dependencies:

\`\`\`bash
npm install discord-rate-limiter
\`\`\`

This package is used for implementing rate limiting in the bot.

