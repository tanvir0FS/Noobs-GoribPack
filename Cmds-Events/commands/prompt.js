const axios = require('axios');
const baseApiUrl = async () => {
  const base = await axios.get(
    `https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json`,
  );
  return base.data.api;
};
module.exports.config ={
    name: "prompt",
    version: "1.6.9",
    credits: "Nazrul",
    hasPermssion: 0,
    description: "image to prompt",
    commandCategory: "tools",
    usages: "reply [image]"
  },

module.exports.run = async ({ api, event,args }) =>{
    const img = event.messageReply?.attachments[0]?.url || args.join(' ');
    if (!img) {
      return api.sendMessage('Please reply to an image.', event.threadID, event.messageID);
    }
    try {
      const prom = (await axios.get(`${await baseApiUrl()}/prompt?url=${encodeURIComponent(img)}`)).data.data[0].response;
         api.sendMessage(prom, event.threadID, event.messageID);
    } catch (error) {
      console.error(error);
      return api.sendMessage('Failed to convert image into text.', event.threadID, event.messageID);
    }
  };
