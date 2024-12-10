const fs = require('fs-extra');
const axios = require('axios');
const path = require('path');

module.exports.config = {
  name: "yt",
  version: "1.6.9",
  hasPermission: 0,
  credits: "Nazrul",
  description: "YouTube Video Downloader",
  commandCategory: "media",
  cooldowns: 2,
  usage: "yt <YouTube Video Link>"
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const link = args.join(" ");

  if (!link) {
    return api.sendMessage("🔖 Please provide a valid YouTube video link!", threadID, messageID);
  }

  const cacheDir = path.join(__dirname, 'cache');
  const videoPath = path.join(cacheDir, 'video.mp4');

  try {
    await fs.ensureDir(cacheDir);

    const apiUrl = `https://ytdl-api-production.up.railway.app/nazrul/ytDL?url=${encodeURIComponent(link)}&type=mp4&quality=360p`;
    const response = await axios.get(apiUrl);
    const { Quality, d_url } = response.data;

    const videoResponse = await axios.get(d_url, { responseType: 'arraybuffer' });
    await fs.writeFile(videoPath, Buffer.from(videoResponse.data));

    const message = `
✅ Here's Downloaded YouTube Video!\n
✨ Video Quality: ${Quality}
    `;

    await api.sendMessage({
      body: message,
      attachment: fs.createReadStream(videoPath)
    }, threadID, async (error, info) => {
      if (error) {
        console.error("Error sending the video:", error);
        return api.sendMessage("❌ Failed to send the video. Please try again later.", threadID, messageID);
      }
     
      await fs.unlink(videoPath);
    }, messageID);

  } catch (error) {
    console.error("Error in yt command:", error);
    return api.sendMessage(`❌Error:\n${error.message}`, threadID, messageID);
  }
};
