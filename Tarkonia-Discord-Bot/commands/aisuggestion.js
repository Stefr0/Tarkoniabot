import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getGeminiSuggestion } from '../utils/geminiApi.js';
import { getUserStats } from '../utils/supabase.js';
import { wrapResponseWithPersonality } from '../utils/personalityResponses.js';
import logger from '../utils/logger.js';

export const data = new SlashCommandBuilder()
  .setName('aisuggestion')
  .setDescription('Get an AI-powered loadout and strategy suggestion with a touch of Tarkov attitude')
  .addStringOption(option =>
    option.setName('playstyle')
      .setDescription('Your preferred play style')
      .setRequired(true)
      .addChoices(
        { name: 'Aggressive', value: 'aggressive' },
        { name: 'Stealthy', value: 'stealthy' },
        { name: 'Balanced', value: 'balanced' },
        { name: 'Sniper', value: 'sniper' },
        { name: 'Scavenger', value: 'scavenger' }
      ));

export async function execute(interaction) {
  await interaction.deferReply();

  try {
    const userId = interaction.user.id;
    const preferredPlayStyle = interaction.options.getString('playstyle');

    const userStats = await getUserStats(userId);

    if (!userStats) {
      await interaction.editReply("No stats found for your account. What, you haven't even done a raid yet? Get out there and die a few times like the rest of us!");
      return;
    }

    const suggestion = await getGeminiSuggestion(userStats, preferredPlayStyle);
    const personalizedSuggestion = wrapResponseWithPersonality(suggestion);

    const embed = new EmbedBuilder()
      .setColor('#4285F4')
      .setTitle('Tarkov Veteran\'s AI-Powered Loadout and Strategy Suggestion')
      .setDescription(personalizedSuggestion)
      .setFooter({ text: 'This suggestion is AI-generated based on your stats and preferred play style, seasoned with the salt of a thousand Tarkov raids.' })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
    logger.info(`AI suggestion with attitude generated for user ${userId} using Gemini API`);
  } catch (error) {
    logger.error('Error getting Gemini AI suggestion:', error);
    await interaction.editReply('Looks like our AI got Tarkoved. Try again later, if you dare.');
  }
}

