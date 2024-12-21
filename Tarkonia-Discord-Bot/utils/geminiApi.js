import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API);

export async function getGeminiSuggestion(userStats, preferredPlayStyle) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Based on the following Escape from Tarkov player statistics and preferred play style, suggest a loadout and strategy:

Player Stats:
- Survival Rate: ${userStats.survivalRate}%
- K/D Ratio: ${userStats.kdRatio}
- Average Raid Duration: ${userStats.avgRaidDuration} minutes
- Preferred Weapons: ${userStats.preferredWeapons.join(', ')}
- Most Visited Maps: ${userStats.mostVisitedMaps.join(', ')}

Preferred Play Style: ${preferredPlayStyle}

Provide a suggested loadout (primary weapon, secondary weapon, armor, backpack, and key items) along with a brief strategy for their next raid.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error('Error getting Gemini suggestion:', error);
    throw error;
  }
}

