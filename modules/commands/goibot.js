module.exports.config = {
  name: "goiadmin",
  version: "1.0.0-beta-fixbyDungUwU",
  permssion: 0,
  prefix: false,
  usePrefix: true,
  commandCategory: "no",
  premium: false,
  credits: "ZyrosGenZ-fixbyDungUwU",
  description: "Bot will rep ng tag admin or rep ng tagbot ",
  category: "Other",
  usages: "",
  cooldowns: 1
};
module.exports.handleEvent = function({ api, event }) {
  if (event.senderID !== "100032407831557","100005881964828","100005881964828") {
    var aid = ["100032407831557","100005881964828","100005881964828"];
    for (const id of aid) {
    if ( Object.keys(event.mentions) == id) {
      var msg = ["আমি থাকতে ওরে কেনো জান?😒", "", "আজ কেউ মেনশন দেয়না বলে"];
      return api.sendMessage({body: msg[Math.floor(Math.random()*msg.length)]}, event.threadID, event.messageID);
    }
    }}
};
module.exports.run = async function({}) {
        }