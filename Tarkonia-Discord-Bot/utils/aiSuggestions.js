import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function getAISuggestion(userStats, preferredPlayStyle) {
  const prompt = `Based on the following Escape from Tarkov player statistics and preferred play style, suggest a loadout and strategy:

Player Stats:
- Survival Rate: ${userStats.survivalRate}%
- K/D Ratio: ${userStats.kdRatio}
- Average Raid Duration: ${userStats.avgRaidDuration} minutes
- Preferred Weapons: ${userStats.preferredWeapons.join(', ')}
- Most Visited Maps: ${userStats.mostVisitedMaps.join(', ')}

Preferred Play Style: ${preferredPlayStyle}

Provide a suggested loadout (primary weapon, secondary weapon, armor, backpack, and key items) along with a brief strategy for their next raid.`;

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: prompt,
      max_tokens: 200,
      n: 1,
      stop: null,
      temperature: 0.7,
    });

    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error('Error getting AI suggestion:', error);
    throw error;
  }
}

