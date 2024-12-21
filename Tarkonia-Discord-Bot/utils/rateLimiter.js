import { RateLimiter } from "discord-rate-limiter";

// Create a rate limiter that allows 5 commands per user per 10 seconds
const limiter = new RateLimiter({
  tokensPerInterval: 5,
  interval: "10 s",
  uniqueTokenPerInterval: 500,
});

export function rateLimitCheck(userId) {
  try {
    const limited = limiter.take(userId);
    return limited;
  } catch (error) {
    console.error('Error in rate limit check:', error);
    return true; // Assume rate limited in case of error
  }
}

