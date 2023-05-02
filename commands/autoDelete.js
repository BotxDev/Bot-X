const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
  data: {
    name: 'autodelete',
    description: 'Delete messages older than a certain time period',
    options: [
      {
        name: 'channel',
        type: 'CHANNEL',
        description: 'The channel to watch for old messages',
        required: true,
      },
      {
        name: 'time',
        type: 'INTEGER',
        description: 'The number of hours after which messages will be deleted',
        required: true,
      },
      {
        name: 'pinned',
        type: 'BOOLEAN',
        description: 'Whether to include pinned messages (default: false)',
        required: false,
      },
    ],
  },

  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    const time = interaction.options.getInteger('time');
    const includePinned = interaction.options.getBoolean('pinned') ?? false;

    if (!channel.isText()) {
      return interaction.reply({
        content: 'The specified channel is not a text channel.',
        ephemeral: true,
      });
    }

    const messages = await channel.messages.fetch({ limit: 100 });

    const now = new Date();
    const oldestAllowedDate = new Date(now - time * 60 * 60 * 1000);

    const messagesToDelete = messages.filter((message) => {
      if (!includePinned && message.pinned) {
        return false;
      }
      return message.createdAt < oldestAllowedDate;
    });

    if (messagesToDelete.size === 0) {
      return interaction.reply({
        content: `There are no messages in ${channel} that are older than ${time} hours.`,
        ephemeral: true,
      });
    }

    const confirmationMessage = `Are you sure you want to delete ${messagesToDelete.size} messages from ${channel}?`;

    const confirmButton = new MessageButton()
      .setCustomId('confirm')
      .setLabel('Yes')
      .setStyle('SUCCESS');

    const cancelButton = new MessageButton()
      .setCustomId('cancel')
      .setLabel('No')
      .setStyle('DANGER');

    const confirmationRow = new MessageActionRow()
      .addComponents(confirmButton, cancelButton);

    const confirmation = await interaction.reply({
      content: confirmationMessage,
      components: [confirmationRow],
      ephemeral: true,
    });

    const filter = (interaction) => {
      return interaction.user.id === interaction.user.id;
    };

    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 10000,
    });

    collector.on('collect', async (interaction) => {
      if (interaction.customId === 'confirm') {
        await Promise.all(messagesToDelete.map((message) => message.delete()));
        await interaction.update({
          content: `Deleted ${messagesToDelete.size} messages from ${channel}.`,
          components: [],
        });
      } else {
        await interaction.update({
          content: 'Cancelled.',
          components: [],
        });
      }
    });

    collector.on('end', async (collected) => {
      if (collected.size === 0) {
        await confirmation.update({
          content: 'Confirmation timed out.',
          components: [],
        });
      }
    });
  },
};
