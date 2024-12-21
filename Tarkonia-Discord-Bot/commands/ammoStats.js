import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { searchAmmo } from '../utils/tarkovApi.js';

export const data = new SlashCommandBuilder()
  .setName('ammostats')
  .setDescription('Get stats for a specific ammunition type')
  .addStringOption(option => 
    option.setName('name')
      .setDescription('The name of the ammo to search for')
      .setRequired(true));

export async function execute(interaction) {
  const ammoName = interaction.options.getString('name');
  
  await interaction.deferReply();

  try {
    const ammo = await searchAmmo(ammoName);
    
    if (!ammo) {
      await interaction.editReply('No ammunition found with that name.');
      return;
    }

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle(ammo.name)
      .addFields(
        { name: 'Damage', value: ammo.damage.toString(), inline: true },
        { name: 'Penetration', value: ammo.penetration.toString(), inline: true },
        { name: 'Armor Damage', value: ammo.armorDamage.toString(), inline: true },
        { name: 'Fragmentation Chance', value: `${ammo.fragmentationChance}%`, inline: true }
      );

    await interaction.editReply({ embeds: [embed] });
  } catch (error) {
    console.error(error);
    await interaction.editReply('There was an error while searching for the ammo stats.');
  }
}

