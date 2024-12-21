import { Collection } from 'discord.js';

const xpData = new Collection();

export function addXP(userId, amount) {
  if (!xpData.has(userId)) {
    xpData.set(userId, { xp: 0, level: 0 });
  }

  const userData = xpData.get(userId);
  userData.xp += amount;

  // Check for level up
  const newLevel = Math.floor(0.1 * Math.sqrt(userData.xp));
  if (newLevel > userData.level) {
    userData.level = newLevel;
    return true; // Level up occurred
  }

  return false; // No level up
}

export function getLeaderboard(limit = 10) {
  return [...xpData.entries()]
    .sort((a, b) => b[1].xp - a[1].xp)
    .slice(0, limit);
}

export function getUserRank(userId) {
  const sortedUsers = [...xpData.entries()].sort((a, b) => b[1].xp - a[1].xp);
  return sortedUsers.findIndex(([id]) => id === userId) + 1;
}

