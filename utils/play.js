const { createAudioPlayer, createAudioResource, joinVoiceChannel } = require('@discordjs/voice');

async function play(guild, song, connection) {
  const player = createAudioPlayer();
  const resource = createAudioResource(ytdl(song.url, { filter: 'audioonly' }));

  player.play(resource);
  connection.subscribe(player);

  player.on('error', error => {
    console.error(`Error playing song: ${error.message}`);
  });
}

module.exports = { play };
