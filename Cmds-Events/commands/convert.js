const axios = require("axios");
const fs = require("fs-extra");
module.exports = {
  config: {
    name: "convert",
    version: "1.6.9",
    description: "Video to audio",
    credits: "Nazrul",
    cooldowns: 5,
    commandCategory: "media",
    usages: "reply to a video",
    hasPermssion: 0
  },
  run: async function ({ api, event }) {
    try {
      if (!event.messageReply || !event.messageReply.attachments || event.messageReply.attachments.length === 0) {
        message.reply("Please reply to a video message to convert it to audio.");
        return;
      }

      const nazrul = event.messageReply.attachments[0];
      if (nazrul.type !== "video") {
        api.sendMessage("The replied content must be a video.", threadID, messageID);
        return;
      }
      const { data } = await axios.get(nazrul.url, { method: 'GET', responseType: 'arraybuffer' });
 const path = __dirname + `/assets/dvia.m4a`
      fs.writeFileSync(path, Buffer.from(data, 'utf-8'));

      const audioReadStream = fs.createReadStream(path);
      const msg = { body: "", attachment: [audioReadStream] };
      api.sendMessage(msg, event.threadID, event.messageID);
    } catch (e) {
      console.log(e);
api.sendMessage(e.message, threadID, messageID)
    }
  },
};
