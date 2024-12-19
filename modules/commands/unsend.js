module.exports.config = {
  name: "uns",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Mirai Team",
  description: "Unsend bot's messages",
  prefix: true,
  category: "message",
  usages: "unsend",
  cooldowns: 0
};

module.exports.run = function({ api, event, getText }) {
  if (!event.messageReply) {
    return api.sendMessage(getText("missingReply"), event.threadID, event.messageID);
  }

  if (event.messageReply.senderID != api.getCurrentUserID()) return api.sendMessage(getText("returnCant"), event.threadID, event.messageID);

  return api.unsendMessage(event.messageReply.messageID);
}

module.exports.languages = {
  "en": {
    "returnCant": "অন্যের মেসেজ আমি কীভাবে আনসেন্ট করনো, আশ্চর্য 😑",
    "missingReply": "কোন মেসেজ টা আনসেন্ট করতে হবে, রিপ্লে তে .uns লেখো🥺"
  }
}
