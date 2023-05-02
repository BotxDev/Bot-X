const { SlashCommandBuilder } = require('@discordjs/builders');
const { play } = require('../utils/play');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Plays a song (Under Development)')
    .addStringOption(option =>
      option.setName('query')
        .setDescription('The song to play')
        .setRequired(true)),
  async execute(interaction) {
    const query = interaction.options.getString('query');

    const { channel } = interaction.member.voice;
    if (!channel) return interaction.reply('You need to join a voice channel first!');

    const songInfo = await ytdl.getInfo(query);
    const song = {
      title: songInfo.videoDetails.title,
      url: songInfo.videoDetails.video_url,
    };

    const player = createAudioPlayer();
    const resource = createAudioResource(ytdl(song.url, { filter: 'audioonly' }));

    player.play(resource);
    connection.subscribe(player);

    return interaction.reply(`Now playing ${song.title}`);
  },
};
