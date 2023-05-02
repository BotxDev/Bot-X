const {Translate} = require('@google-cloud/translate').v2;
const translate = new Translate({
  // Load the API key from the .env file
  key: process.env.GOOGLE_CLOUD_API_KEY
});
const {MessageEmbed} = require('discord.js');

// Specify the target language for translation
const targetLanguage = 'en';

module.exports = {
  name: 'auto-translate',
  execute: async (message) => {
    // Only auto-translate non-bot messages
    if (message.author.bot) return;
    
    // Detect the source language of the message
    const [detection] = await translate.detect(message.content);
    const sourceLanguage = detection.language;

    // Skip if the source language is undetermined
    if (sourceLanguage === 'und') return;

    // Only translate messages that are not already in the target language
    if (sourceLanguage !== targetLanguage) {
      // Translate the message to the target language
      const [translation] = await translate.translate(message.content, targetLanguage);

      // Create an embed to display the original and translated messages
      const embed = new MessageEmbed()
        .setColor('#0EA35F')
        .setTitle('Auto Translation')
        .setAuthor('Google Cloud Translate', 'https://cdn4.iconfinder.com/data/icons/google-i-o-2016/512/google_firebase-2-512.png')
        .addFields(
          { name: 'Source Language', value: '**' + sourceLanguage + '**'},
          { name: 'Original', value: '> ' + message.content },
          { name: 'Translation', value: '> ' + translation },
          { name: 'Credits', value: 'Translation provided by @google-cloud/translate/Lauv v2 \n __Developed by Joshua J__' }
        );

      // Send the embed to the same channel as the original message
      message.channel.send({ embeds: [embed] });
    }
  }
};
