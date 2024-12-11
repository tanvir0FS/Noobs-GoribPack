const axios = require("axios");

module.exports.config = {
  name: "album",
  version: "1.6.9",
  hasPermission: 0,
  credits: "Nazrul",
  commandCategory: "media",
  description: "Get Video From Album list",
  cooldowns: 2,
  usage: "type [album] [page number]"
};

module.exports.run = async ({ api, event, args }) => {
  const page = args[0] ? parseInt(args[0]) : 1;
  let albumMsg = "";

  if (page === 1) {
    albumMsg = `
🪄 ♡ Album Videos ♡ 🪄
┌───────────────┐
│ 0. Attitude    │
│ 1. Status      │
│ 2. Natural     │
│ 3. Islamic     │
│ 4. Love        │
│ 5. Sura        │
│ 6. Free Fire   │
│ 7. Sad         │
│ 8. Anime       │
│ 9. Cute Baby   │
└───────────────┘
👉 Reply with the number (0-9) to see your video!\n\nor 🎉 use /album 2 to see another page✅`;
  } else if (page === 2) {
    albumMsg = `
🪄 ♡ 18+ Videos ♡ 🪄
┌───────────────┐
│ 10. Hot         │
│ 11. Sex    │
│ 12. Horny       │
│ 13. Item   │
└───────────────┘
👉 Reply with the number (10-13) to see your video!`;
  } else {
    return api.sendMessage("❌ Invalid page number. Please use /album 1 or /album 2.", event.threadID, event.messageID);
  }

  api.sendMessage(albumMsg, event.threadID, (error, info) => {
    if (!error) {
      global.client.handleReply.push({
        name: this.config.name,
        type: "reply",
        messageID: info.messageID,
        author: event.senderID,
        currentPage: page,
      });
    }
  }, event.messageID);
};

module.exports.handleReply = async ({ api, event, handleReply }) => {
  try {
    api.unsendMessage(handleReply.messageID);

    const reply = event.body.trim();
    let nazrulUrl;

    if (handleReply.currentPage === 1) {
      // Page 1 Options
      const page1Urls = {
        '0': "https://x-noobs-api.vercel.app/video/attitude",
        '1': "https://x-noobs-api.vercel.app/video/status2",
        '2': "https://x-noobs-api.vercel.app/video/natural",
        '3': "https://x-noobs-api.vercel.app/video/islam",
        '4': "https://x-noobs-api.vercel.app/video/love",
        '5': "https://x-noobs-api.vercel.app/video/sura",
        '6': "https://x-noobs-api.vercel.app/video/ff",
        '7': "https://x-noobs-api.vercel.app/video/sad",
        '8': "https://x-noobs-api.vercel.app/video/anime",
        '9': "https://x-noobs-api.vercel.app/video/baby"
      };
      nazrulUrl = page1Urls[reply];
    } else if (handleReply.currentPage === 2) {

      const page2Urls = {
        '10': "https://x-noobs-api.vercel.app/video/hot",
        '11': "https://x-noobs-api.vercel.app/video/sex",
        '12': "https://x-noobs-api.vercel.app/video/horny",
        '13': "https://x-noobs-api.vercel.app/video/item"
      };
      nazrulUrl = page2Urls[reply];
    }

    if (!nazrulUrl) {
      return api.sendMessage("❌ Invalid choice. Please reply with a valid number.", event.threadID, event.messageID);
    }

    const res = await axios.get(nazrulUrl);
    if (res.data && res.data.data) {
      const videoStream = (await axios.get(res.data.data, { responseType: "stream" })).data;
      api.sendMessage({
        body: "✅ Here's your Video that you want!",
        attachment: videoStream
      }, event.threadID, event.messageID);
    } else {
      throw new Error("Invalid video data received from the API.");
    }
  } catch (error) {
    api.sendMessage("⚠️ Error fetching video: " + error.message, event.threadID, event.messageID);
  }
};
