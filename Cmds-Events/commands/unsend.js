module.exports.config = {
	name: "unsend",
	version: "1.6.9",
	hasPermssion: 0,
	credits: "Nazrul",
	description: "Reply Message to unsend & remove",
	commandCategory: "system",
	usages: "unsend",
	cooldowns: 0
};

module.exports.languages = {
	"en": {
		"returnCant": "Can't unsend other user message",
		"missingReply": "Please reply a message to unsend!"
	}
}

module.exports.run = function({ api, event, getText }) {
	if (event.messageReply.senderID != api.getCurrentUserID()) return api.sendMessage(getText("returnCant"), event.threadID, event.messageID);
	if (event.type != "message_reply") return api.sendMessage(getText("missingReply"), event.threadID, event.messageID);
	return api.unsendMessage(event.messageReply.messageID);
	}
