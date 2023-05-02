const { MessageEmbed } = require('discord.js');

module.exports = {
  data: {
    name: 'load',
    description: 'Sends an embed when the bot loads',
  },
  async execute(interaction) {
    const embed = new MessageEmbed()
      .setTitle('Bot Loaded')
      .setDescription('The bot has finished loading and is now online!')
      .setColor('GREEN');
    
    await interaction.reply({ embeds: [embed] });

    const channel = interaction.guild.channels.cache.find(channel => channel.name === 'general');
    if (channel) {
      channel.send({ embeds: [embed] });
    }
  },
};
