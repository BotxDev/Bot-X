const fs = require('fs');
const { MessageEmbed } = require('discord.js');

let settings = {};
try {
  settings = require('../settings.json');
} catch (err) {
  console.error('Error loading settings:', err);
}

async function autoMod(message) {
  const { author, content, guild } = message;

  if (!guild) {
    // If the message doesn't belong to a guild, return
    return;
  }

  const guildId = guild.id;

  if (!settings[guildId]?.autoModEnabled) {
    // Auto moderation is not enabled for this server
    return;
  }

  // Check if the message contains a link
  if (content.match(/https?:\/\/\S+/gi)) {

    // Check if the author has roles
    const hasWhitelistedRole = await hasRoles(author, guild, settings[guildId]?.autoModWhitelist);
    console.log('Has whitelisted role:', hasWhitelistedRole);
    if (!hasWhitelistedRole) {
      // Send a DM to the author
      if (content.trim().length > 0) { // Check if content is not empty or whitespace only
        const embed = new MessageEmbed()
          .setTitle('No direct links allowed')
          .setDescription('Please refrain from posting direct links in this server.')
          .setColor(0xFF0000)
          .setThumbnail('https://cdn.discordapp.com/attachments/1079837804508487855/1102409366335918140/Bot_5.gif');

        author.send({ embeds: [embed] })
          .catch(console.error);
      }

      // Log the user's details to a JSON file
      const logEntry = {
        userId: author.id,
        username: author.username,
        discriminator: author.discriminator,
        content: content,
        timestamp: new Date().toISOString()
      };
      const logData = JSON.stringify(logEntry, null, 2);
      fs.appendFileSync('link-log.json', `${logData}\n`);

      // Delete the message
      message.delete()
        .then(() => console.log('Message deleted successfully'))
        .catch(error => console.error('Error deleting message:', error));
    }
  }
}




async function hasRoles(user, guild, autoModWhitelist) {
  if (!user) {
    return false;
  }

  try {
    const member = await guild.members.fetch({ user: user.id, force: true });
    if (!member.roles || !member.roles.cache || !member.roles.cache.size) {
      console.log(`User ${user.id} has no roles`);
      return false;
    }

    console.log(`User ${user.id} roles:`, member.roles.cache.map(role => role.id));
    console.log(`AutoMod whitelist for guild ${guild.id}:`, autoModWhitelist);

    if (!autoModWhitelist?.length) {
      return member.roles.cache.size > 1;
    }

    const hasWhitelistedRole = member.roles.cache.some(role => autoModWhitelist.includes(role.id));
    console.log(`User ${user.id} has whitelisted role:`, hasWhitelistedRole);
    return hasWhitelistedRole;
  } catch (error) {
    console.error(`Error fetching member ${user.id}:`, error);
    return false;
  }
}










module.exports = { autoMod, hasRoles };
