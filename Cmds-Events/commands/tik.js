const fs = require('fs-extra');
const axios = require('axios');

module.exports.config = {
  name: "tik",
  version: "1.6.9.",
  hasPermission: 0,
  credits: "Nazrul",
  description: "TikTok Video Downloader",
  commandCategory: "video downloader",
  cooldowns: 2,
  usage: "tiktok video link"
};

module.exports.run = async function ({ api, event, args }) {
  let link = args.join(" ");

  if (!link) {
    api.sendMessage("Please put a valid TikTok video link", event.threadID, event.messageID);
    return;
  }

  try {
   let path = __dirname + `/cache/`;
    const res = await axios.get(`https://www.x-noobs-apis.000.pe/nazrul/tikDL?url=${encodeURI(link)}`);
    await fs.ensureDir(path);
   path += 'N4ZR9L.mp4';
    const data = res.data.data;
    const vid = (await axios.get(data.url, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(path, Buffer.from(vid, 'stream'));
    api.sendMessage({
      body: `✅ Here's Downloaded Tiktok Video✨ `, attachment: fs.createReadStream(path)
    }, event.threadID, () => fs.unlinkSync(path), event.messageID);

  } catch (e) {
    api.sendMessage(`${e}`, event.threadID, event.messageID);
  };
};
