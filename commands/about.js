const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('about')
    .setDescription('Displays information about the bot'),
  async execute(interaction) {
    const embed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle('BotX Details & Credits')
      .setDescription('This is a public Discord bot written in Discord.js v13.0.1 ')
      .addField('GitHub', 'Joshua J', true)
      .addField('Release Version', '1.0.0', true)
      .setImage('https://cdn.discordapp.com/attachments/1079837804508487855/1102409366335918140/Bot_5.gif')
    await interaction.reply({ embeds: [embed] });
  },
};
