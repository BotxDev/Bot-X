const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');

const problemCommand = new SlashCommandBuilder()
    .setName('problem')
    .setDescription('Create an embed for reporting a problem')
    .addStringOption(option =>
        option.setName('title')
            .setDescription('The title of the problem report')
            .setRequired(true))
    .addStringOption(option =>
        option.setName('description')
            .setDescription('A description of the problem')
            .setRequired(true));

module.exports = {
    data: problemCommand,
    async execute(interaction) {
        try {
            if (!interaction.member.permissions.has('ADMINISTRATOR')) {
                return interaction.reply({
                    content: 'You do not have permission to use this command.',
                    ephemeral: true
                });
            }

            const title = interaction.options.getString('title');
            const description = interaction.options.getString('description');

            const problemEmbed = new MessageEmbed()
                .setTitle(title)
                .setDescription(description)
                .setColor('RED');

            const fixedButton = new MessageButton()
                .setCustomId('fixed')
                .setLabel('Fixed')
                .setStyle('SUCCESS');
            const actionRow = new MessageActionRow()
                .addComponents(fixedButton);

            const message = await interaction.reply({ embeds: [problemEmbed], components: [actionRow] });

            const filter = (interaction) => {
                return interaction.customId === 'fixed' && interaction.user.id === interaction.message.author.id;
            };
            const collector = message.createMessageComponentCollector({ filter, time: 15000 });

            collector.on('collect', async (interaction) => {
                console.log('Button clicked!');
                const updatedEmbed = new MessageEmbed(problemEmbed).setColor('GREEN');
                await interaction.reply({ embeds: [updatedEmbed], ephemeral: true });
            });

            collector.on('end', async () => {
                console.log('Collector ended');
                await message.delete();
            });
        } catch (error) {
            console.error(error);
            return interaction.reply({
                content: 'An error occurred while processing the command.',
                ephemeral: true
            });
        }
    },
};
