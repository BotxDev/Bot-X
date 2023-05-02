const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const responses = [
  'Messages have been deleted successfully',
  'Done!',
  'Messages deleted',
  'Your wish is my command, messages deleted',
  'Poof! The messages are gone',
  'Cleaning up the channel',
  'Messages have been banished!',
  'The messages have been sent to the shadow realm',
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('delete')
    .setDescription('Deletes a certain number of old messages')
    .addIntegerOption(option => 
      option.setName('count')
        .setDescription('The number of messages to delete')
        .setRequired(false))
    .addStringOption(option =>
      option.setName('before')
        .setDescription('Delete messages before this message ID')
        .setRequired(false)),
  async execute(interaction) {
    const deleteCount = interaction.options.getInteger('count') || 100;
    const beforeId = interaction.options.getString('before');

    if (isNaN(deleteCount) || deleteCount < 1 || deleteCount > 100) {
      return await interaction.reply('Please provide a valid number between 1 and 100 for the number of messages to delete');
    }

    const memberPermissions = interaction.member.permissions;
    const botPermissions = interaction.guild.me.permissions;

    if (!memberPermissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
      return await interaction.reply('You do not have permission to delete messages');
    }

    if (!botPermissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
      return await interaction.reply('I do not have permission to delete messages');
    }

    let fetched;
    if (beforeId) {
      const message = await interaction.channel.messages.fetch(beforeId).catch(() => null);
      if (!message) {
        return await interaction.reply('Could not find a message with the provided ID');
      }
      fetched = await interaction.channel.messages.fetch({ limit: deleteCount, before: message.id });
    } else {
      fetched = await interaction.channel.messages.fetch({ limit: deleteCount });
    }

    interaction.channel.bulkDelete(fetched)
      .then(() => {
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        interaction.reply(randomResponse);
      })
      .catch(error => {
        console.error(`Failed to delete messages in ${interaction.channel.name} - ${error} **contact Joshua J**`);
        interaction.reply(`Failed to delete messages - ${error} | **Contact Joshua J**`);
      });
  },
};
