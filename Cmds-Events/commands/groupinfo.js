const fs = require("fs");
const request = require("request");

module.exports.config = {
  name: "groupinfo",
  version: "1.6.9",
  hasPermssion: 0,
  credits: "Nazrul",
  description: "View your box information",
  commandCategory: "Box",
  usages: "groupinfo",
  cooldowns: 0,
  dependencies: []
};

module.exports.run = async function({ api, event, args }) {
  let threadInfo = await api.getThreadInfo(event.threadID);
  const memLength = threadInfo.participantIDs.length;
  const gendernam = [];
  const gendernu = [];
  const nope = [];

  for (let z in threadInfo.userInfo) {
    const gioitinhone = threadInfo.userInfo[z].gender;
    const nName = threadInfo.userInfo[z].name;
    if (gioitinhone === "MALE") {
      gendernam.push(nName);
    } else if (gioitinhone === "FEMALE") {
      gendernu.push(nName);
    } else {
      nope.push(nName);
    }
  }

  const nam = gendernam.length;
  const nu = gendernu.length;
  const qtv = threadInfo.adminIDs.length;
  const sl = threadInfo.messageCount;
  const icon = threadInfo.emoji;
  const threadName = threadInfo.threadName;
  const id = threadInfo.threadID;
  const sex = threadInfo.approvalMode;
  const approvalStatus = sex ? '✅ Turned On' : '❌ Turned Off';
  
  const callback = () => 
    api.sendMessage(
      {
        body: `🎉 **Group Information** 🎉\n\n
🔹 **Group Name:** ${threadName}\n
🔹 **Group ID:** ${id}\n
🔹 **Approval Mode:** ${approvalStatus}\n
🔹 **Group Emoji:** ${icon}\n
🔹 **Total Members:** ${memLength} members\n
🔹 **Males:** ${nam} members 👨\n
🔹 **Females:** ${nu} members 👩\n
🔹 **Admins:** ${qtv} administrators 👑\n
🔹 **Total Messages:** ${sl} messages 📚\n\n
📅 **Updated by:** *Nazrul* 💻`,
        attachment: fs.createReadStream(__dirname + '/cache/1.png')
      },
      event.threadID,
      () => fs.unlinkSync(__dirname + '/cache/1.png'),
      event.messageID
    );
  
  return request(encodeURI(`${threadInfo.imageSrc}`))
    .pipe(fs.createWriteStream(__dirname + '/cache/1.png'))
    .on('close', () => callback());
};
