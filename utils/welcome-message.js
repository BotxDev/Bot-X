// Import the necessary Discord.js modules
const { MessageEmbed } = require('discord.js');

// Define a function to send a welcome message to a user
async function sendWelcomeMessage(user) {
  // Create a new embed for the welcome message
  const embed = new MessageEmbed()
    .setTitle(`Welcome to the server, ${user.username}!`)
    .setDescription(`We're glad to have you here. Please take a moment to review the server rules and introduce yourself in the #introductions channel.`)
    .setColor('GREEN')
    .setThumbnail('https://cdn.discordapp.com/attachments/1079837804508487855/1102409366335918140/Bot_5.gif')
    .addField('Got improvement ideas?', 'You can either submit them on our Discord, or GitHub :) ', true)
    .setTimestamp();

  // Send the welcome message to the user
  try {
    const dmChannel = await user.createDM();
    await dmChannel.send({ embeds: [embed] });
  } catch (error) {
    console.error(`Failed to send welcome message to user ${user.username}:`, error);
  }
}

module.exports = {
  sendWelcomeMessage
};
