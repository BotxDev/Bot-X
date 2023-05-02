const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('automod')
    .setDescription('Enable or disable auto moderation')
    .addBooleanOption(option =>
      option.setName('enabled')
        .setDescription('Whether to enable or disable auto moderation')
        .setRequired(true)),
  async execute(interaction) {
    const guildId = interaction.guildId;
    const enabled = interaction.options.getBoolean('enabled');

    let settings = {};
    try {
      settings = require('../settings.json');
    } catch (err) {
      console.error('Error loading settings:', err);
      return interaction.reply('An error occurred while loading the settings!');
    }

    if (!settings[guildId]) {
      settings[guildId] = {};
    }
    settings[guildId].autoModEnabled = enabled;

    fs.writeFile('./settings.json', JSON.stringify(settings, null, 2), (err) => {
      if (err) {
        console.error('Error saving settings:', err);
        return interaction.reply('An error occurred while saving the settings!');
      }
      return interaction.reply(`Auto moderation has been ${enabled ? 'enabled' : 'disabled'}!`);
    });
  },
};
