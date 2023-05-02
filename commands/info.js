const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Displays information about a user')
    .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true)),
  async execute(interaction) {
    try {
      const target = interaction.options.getUser('user', true);
      const member = interaction.guild.members.cache.get(target.id);

      const roles = member.roles.cache
        .sort((a, b) => b.position - a.position)
        .map(role => role.toString())
        .slice(0, -1);

      const joinDate = member.joinedAt.toLocaleDateString('en-US');

      const embed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle(`${target.tag}'s Info`)
        .setDescription(`This is some information about ${target}`)
        .addFields(
          { name: 'ID', value: target.id, inline: true },
          { name: 'Join Date', value: joinDate, inline: true },
          { name: 'Created At', value: target.createdAt.toLocaleString(), inline: true },
          { name: 'Roles', value: roles.length ? roles : 'None' },
        );

      // Check if presence is defined before accessing its properties
      if (target.presence) {
        embed.addFields(
          { name: 'Status', value: target.presence.status.toUpperCase(), inline: true },
          { name: 'Activity', value: target.presence.activities[0]?.name || 'None', inline: true },
        );
      } else {
        embed.addField('Status', 'None', true);
        embed.addField('Activity', 'None', true);
      }

      embed.setThumbnail(target.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setFooter('Developed by Joshua J - Lauv ©Copyright 2021');

      await interaction.reply({ embeds: [embed] });
      console.log(`Replied to ${interaction.user.tag} in ${interaction.channel.name} with: ${embed}`);
    } catch (error) {
      console.error(error);
      await interaction.reply('An error occurred while executing this command.');
    }
  },
};
