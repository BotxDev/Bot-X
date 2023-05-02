const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');

let todos = [
    
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('todo')
    .setDescription('Create, remove, or edit a To-Do item.')
    .addSubcommand(subcommand =>
      subcommand
        .setName('add')
        .setDescription('Add a new To-Do item.')
        .addStringOption(option =>
          option.setName('text')
            .setDescription('The text of the To-Do item.')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('remove')
        .setDescription('Remove a To-Do item.')
        .addIntegerOption(option =>
          option.setName('index')
            .setDescription('The index of the To-Do item to remove.')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('edit')
        .setDescription('Edit a To-Do item.')
        .addIntegerOption(option =>
          option.setName('index')
            .setDescription('The index of the To-Do item to edit.')
            .setRequired(true)
        )
        .addStringOption(option =>
          option.setName('text')
            .setDescription('The new text of the To-Do item.')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('list')
        .setDescription('List all To-Do items.')
    ),

  async execute(interaction) {
    if (interaction.options.getSubcommand() === 'add') {
      const todo = interaction.options.getString('text');
      todos.push(todo);
      fs.writeFileSync('todos.json', JSON.stringify(todos));
      await interaction.reply(`Added "${todo}" to the To-Do list.`);
    } else if (interaction.options.getSubcommand() === 'remove') {
      const index = interaction.options.getInteger('index');
      if (index < 1 || index > todos.length) {
        return await interaction.reply('Invalid To-Do item index.');
      }
      const todo = todos.splice(index - 1, 1)[0];
      fs.writeFileSync('todos.json', JSON.stringify(todos));
      await interaction.reply(`Removed "${todo}" from the To-Do list.`);
    } else if (interaction.options.getSubcommand() === 'edit') {
      const index = interaction.options.getInteger('index');
      if (index < 1 || index > todos.length) {
        return await interaction.reply('Invalid To-Do item index.');
      }
      const todo = interaction.options.getString('text');
      todos[index - 1] = todo;
      fs.writeFileSync('todos.json', JSON.stringify(todos));
      await interaction.reply(`Edited To-Do item ${index} to "${todo}".`);
    } else if (interaction.options.getSubcommand() === 'list') {
      if (todos.length === 0) {
        return await interaction.reply('The To-Do list is empty.');
      }
      const embed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('To-Do List')
        .setDescription('These are your current To-Do items:');
      todos.forEach((todo, index) => {
        embed.addField(`#${index + 1}`, todo);
      });
      await interaction.reply({ embeds: [embed] });
    }
  }
};
