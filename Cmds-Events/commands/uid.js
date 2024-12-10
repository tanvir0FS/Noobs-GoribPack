module.exports.config = {
  name: "uid",
  version: "1.6.9",
  hasPermssion: 0,
  credits: "Nazrul",
  description: "use to get fb uid.",
  commandCategory: "tools",
  cooldowns: 5
};

module.exports.run = function({ api, event }) {
  if (event.messageReply) {
    
    api.sendMessage(`${event.messageReply.senderID}`, event.threadID, event.messageID);
  } else if (Object.keys(event.mentions).length == 0) {
    api.sendMessage(`${event.senderID}`, event.threadID, event.messageID);
  } else {
    for (var i = 0; i < Object.keys(event.mentions).length; i++) {
      api.sendMessage(`${Object.values(event.mentions)[i].replace('@', '')}: ${Object.keys(event.mentions)[i]}`, event.threadID);
    }
  }
};
