const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('google')
    .setDescription('Get a link to Google.'),
  async execute(interaction) {
    await interaction.reply('Here is a link to Google: https://www.google.com/');
  },
};
