const ytdl = require('ytdl-core');
const search = require('yt-search');

async function searchVideo(query) {
  try {
    const { videos } = await search(query);
    if (videos && videos.length > 0) {
      return videos[0];
    }
    return null;
  } catch (error) {
    console.error(`Error searching for video: ${error}`);
    return null;
  }
}

async function getVideoStream(url) {
  return ytdl(url, { filter: 'audioonly', quality: 'highestaudio' });
}

module.exports = {
  searchVideo,
  getVideoStream,
};
