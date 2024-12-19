const fs = require('fs');
const path = require('path');
const yts = require('yt-search');
const ytdl = require('@distube/ytdl-core');

module.exports.config = {
  name: "music",
  version: "1.0.0",
  permission: 0,
  credits: "Jonell Magallanes",
  description: "Get music",
  category: "media",
  prefix: true,
  usages: "[music name]",
  cooldowns: 10
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;

  if (!args[0]) {
    return api.sendMessage(`গানের নাম তো লেখবা baby😫\n\n example:.music ishq`, threadID);
  }

  try {
    const song = args.join(" ");
    const findingMessage = await api.sendMessage(`🔍 | 𝘧𝘪𝘯𝘥𝘪𝘯𝘨 𝘵𝘩𝘪𝘴 𝘴𝘰𝘯𝘨\n\n"${song}"\n\n Please 𝘱𝘭𝘦𝘢𝘴𝘦 𝘸𝘢𝘪𝘵 𝘣𝘢𝘣𝘺...`, threadID);

    const searchResults = await yts(song);
    const firstResult = searchResults.videos[0];

    if (!firstResult) {
      return api.editMessage(`❌ | No results found for "${song}".`, findingMessage.messageID, threadID);
    }

    const { title, url } = firstResult;
    await api.editMessage(`[🤍] 𝘮𝘶𝘴𝘪𝘤 𝘧𝘰𝘶𝘯𝘥 \n 𝘴𝘦𝘯𝘥𝘪𝘯𝘨... 𝘗𝘭𝘦𝘢𝘴𝘦 𝘸𝘢𝘪𝘵`, findingMessage.messageID, threadID);

    const filePath = path.resolve(__dirname, 'cache', `${Date.now()}.mp3`);
    const videoInfo = await ytdl.getBasicInfo(url);

    if (videoInfo.videoDetails.lengthSeconds > 600) {
      return api.editMessage(`❌ | ভিডিওটা ১০ মিনিট এর অধিক, তাই ডাউনলোড করতে অক্ষম টাইটেল: "${title}".`, findingMessage.messageID, threadID);
    }

    const fileStream = fs.createWriteStream(filePath);
    ytdl(url, { filter: 'audioonly' }).pipe(fileStream);

    fileStream.on('finish', async () => {
      const stats = fs.statSync(filePath);
      const fileSizeInMB = stats.size / (1024 * 1024);

      if (fileSizeInMB > 25) {
        fs.unlinkSync(filePath);
        return api.editMessage(`❌ | The file size exceeds the 25MB limit. Unable to send "${title}".`, findingMessage.messageID, threadID);
      }

      await api.sendMessage(
        {
          body: `[🤍] 𝘴𝘵𝘢𝘺 𝘸𝘪𝘵𝘩 𝘛𝘢𝘯𝘷𝘪𝘳 𝘉𝘰𝘵 `,
          attachment: fs.createReadStream(filePath)
        },
        threadID
      );

      fs.unlinkSync(filePath);
      api.unsendMessage(findingMessage.messageID);
    });

    fileStream.on('error', async (error) => {
      fs.unlinkSync(filePath);
      await api.editMessage(`❌ | Error while saving the file: ${error.message}`, findingMessage.messageID, threadID);
    });
  } catch (error) {
    await api.sendMessage(`❌ | An error occurred: ${error.message}`, threadID, messageID);
  }
};
