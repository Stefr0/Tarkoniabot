import { EmbedBuilder } from 'discord.js';
import { getTraders } from './tarkovApi.js';

export async function checkTraderResets(client) {
  const traders = await getTraders();
  
  for (const trader of traders) {
    if (Date.now() >= trader.resetTime) {
      const channel = await client.channels.fetch(process.env.NOTIFICATIONS_CHANNEL_ID);
      
      const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle(`${trader.name} has reset!`)
        .setDescription(`${trader.name}'s inventory has been refreshed. Go check out the new items!`)
        .setTimestamp();

      await channel.send({ embeds: [embed] });
    }
  }
}

