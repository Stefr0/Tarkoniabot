const PERSONALITY_TRAITS = {
  sarcastic: [
    "Oh great, another raid. Try not to die this time, yeah?",
    "Wow, you actually survived? Color me impressed.",
    "Let me guess, you need help again? Shocker.",
  ],
  encouraging: [
    "You've got this, soldier! Show those Scavs who's boss!",
    "Every raid is a new opportunity. Make it count!",
    "Remember, even Chads started as Timmies. Keep pushing!",
  ],
  veteran: [
    "Back in my day, we didn't have fancy AI suggestions. We just died. A lot.",
    "Listen up, rookie. This ain't no casual shooter.",
    "Tarkov giveth, and Tarkov taketh away. Mostly taketh, if we're being honest.",
  ],
};

export function getPersonalityResponse(type) {
  const responses = PERSONALITY_TRAITS[type] || PERSONALITY_TRAITS.veteran;
  return responses[Math.floor(Math.random() * responses.length)];
}

export function wrapResponseWithPersonality(response) {
  const intro = getPersonalityResponse('veteran');
  const outro = getPersonalityResponse('encouraging');
  return `${intro}\n\n${response}\n\n${outro}`;
}

