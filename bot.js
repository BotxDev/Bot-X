console.clear();

require('dotenv').config();
const { Client, Intents, Collection, GuildMemberRoleManager, MessageEmbed } = require('discord.js');
const fs = require('fs');
const { green, bgWhite, bold, red, white, blue } = require('kleur');
const autoTranslateModule = require('./utils/auto-translate-module');
const { autoMod } = require('./utils/auto-mod.js');



const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_BANS,
    Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    Intents.FLAGS.GUILD_INVITES,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_MESSAGE_TYPING,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGE_TYPING
  ]
});

client.commands = new Collection();


async function deleteCommands() {
  const commands = await client.application.commands.fetch();
  console.log(commands, commands.length);
  if (commands.size) {
    for (const command of commands.values()) {
      console.log(blue(`🗑  Deleting command: ${command.name}`));
      await client.application.commands.delete(command.id);
      console.log(red(`✅  Deleted command: ${command.name}`));
    }
  } else {
    console.log('👀  No commands are registered');
  }
}

async function registerCommands() {
  const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

  // Loop through each command file and register it
  for (const file of commandFiles) {
    try {
      const command = require(`./commands/${file}`);
      client.commands.set(command.data.name, command);
      await client.application.commands.create(command.data);
      console.log(green(`✅  Registered command: ${command.data.name}`));
    } catch (error) {
      console.error(red(`❌  Failed to register command in file ${file}:`), error);
    }
  }
}

async function init() {
  const commands = [];
  const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command);
  }

  console.log(`📥  Loading ${commands.length} commands...`);
  client.commands = new Collection();
  commands.forEach(command => client.commands.set(command.data.name, command));

  await client.login(process.env.DISCORD_TOKEN);
  // await deleteCommands();
  // await registerCommands();
  console.log(`🚀  Logged in as ${client.user.tag}`);
  // await sendEmbedOnLoad();
}

init();

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command! **Contact Joshua J**', ephemeral: true });
  }
});

async function sendEmbedOnLoad() {
  const channel = client.channels.cache.find(channel => channel.name === 'general');
  const embed = new MessageEmbed()
    .setTitle('Bot is now online!')
    .setColor('#00FF00')
    .setDescription('This is a test message sent when the bot loads.')
    .setTimestamp()
    .setAuthor(client.user.username, client.user.displayAvatarURL())
    .addFields(
      { name: 'Time', value: new Date().toLocaleString() },
      { name: 'Discord.js Version', value: 'v13.0.1'},
      { name: 'Lauv Version', value: 'v28.9.1' },
      { name: 'Number of Commands', value: client.commands.size.toString() },
      { name: 'BotX Admins', value: '**Joshua J, Visiion**' },
    );
  await channel.send({ embeds: [embed] });
  console.log('Message Sent. Bot is ready to receive commands.');
  client.user.setActivity('for commands', { type: 'WATCHING' });
}

// Define the server ID and role ID
const serverId = '1102399343706787970';
const roleId = '1102400426021765161';

// Listen for the guildMemberAdd event
client.on('guildMemberAdd', async (member) => {
  if (member.guild.id !== serverId) {
    return; // Ignore if not in the specified server
  }

  // Assign the auto role
  try {
    const role = member.guild.roles.cache.get(roleId);
    await member.roles.add(role);
  } catch (error) {
    console.error(`Failed to assign auto role: ${error}`);
  }
});


client.on('messageCreate', (message) => {
  autoTranslateModule.execute(message);
});


const { sendWelcomeMessage } = require('./utils/welcome-message.js');


client.on('message', message => {
  autoMod(message);
});


// ! Auto roll. 
// * Change the role assigned when a user joins the server by changing roleId


client.on('guildMemberAdd', async member => {
  // TODO: Get the role ID from the bot's memory
  const roleId = '1102772880221163591';
  const role = member.guild.roles.cache.get(roleId);
  if (role) {
    await member.roles.add(role);
    console.log(`Assigned role ${role.name} to new member ${member.user.tag}.`);
  }
  sendWelcomeMessage(member.user);
});