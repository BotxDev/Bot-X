const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('whitelist')
        .setDescription('Add or remove roles from the auto-mod whitelist')
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Add a role to the whitelist')
                .addStringOption(option =>
                    option.setName('role')
                        .setDescription('The name of the role to add')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Remove a role from the whitelist')
                .addStringOption(option =>
                    option.setName('role')
                        .setDescription('The name of the role to remove')
                        .setRequired(true))),
    async execute(interaction) {
        const guildId = interaction.guild.id;
        let settings = JSON.parse(fs.readFileSync('./settings.json'));
        const whitelist = settings[guildId].autoModWhitelist;
        const subcommand = interaction.options.getSubcommand();
        const roleName = interaction.options.getString('role');

        if (subcommand === 'add') {
            const role = interaction.guild.roles.cache.find(role => role.name === roleName);
            if (!role) {
                return interaction.reply(`Role "${roleName}" not found.`);
            }
            if (whitelist.includes(role.id)) {
                return interaction.reply(`Role "${roleName}" is already in the whitelist.`);
            }
            whitelist.push(role.id);
            settings[guildId].autoModWhitelist = whitelist;
            fs.writeFile('./settings.json', JSON.stringify(settings), (err) => {
                if (err) {
                    console.error(err);
                    return interaction.reply('An error occurred while updating the whitelist.');
                }
                return interaction.reply(`Role "${roleName}" added to the whitelist.`);
            });
        }

        if (subcommand === 'remove') {
            const role = interaction.guild.roles.cache.find(role => role.name === roleName);
            if (!role) {
                return interaction.reply(`Role "${roleName}" not found.`);
            }
            const index = whitelist.indexOf(role.id);
            if (index === -1) {
                return interaction.reply(`Role "${roleName}" is not in the whitelist.`);
            }
            whitelist.splice(index, 1);
            settings[guildId].autoModWhitelist = whitelist;
            fs.writeFile('./settings.json', JSON.stringify(settings), (err) => {
                if (err) {
                    console.error(err);
                    return interaction.reply('An error occurred while updating the whitelist.');
                }
                return interaction.reply(`Role "${roleName}" removed from the whitelist.`);
            });
        }
    }
};
