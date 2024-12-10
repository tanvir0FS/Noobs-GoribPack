module.exports.config = {
  name: "out",
  version: "1.6.9",
  hasPermssion: 2,
  credits: "Nazrul",
  description: "out box",
  commandCategory: "admin",
  usages: "out [tid]",
  cooldowns: 3
};

module.exports.run = async function({ api, event, args }) {
    const tid = args.join(" ");
    
    // If no tid is provided, remove the bot from the current thread
    if (!tid) {
        return api.removeUserFromGroup(api.getCurrentUserID(), event.threadID, () => {
            api.sendMessage("Good bye Guys🌊", event.threadID, event.messageID);
        });
    }
    
    // If a tid is provided, remove the bot from that thread
    return api.removeUserFromGroup(api.getCurrentUserID(), tid, () => {
        api.sendMessage("Good bye Guys🌊", event.threadID, event.messageID);
    });
}
