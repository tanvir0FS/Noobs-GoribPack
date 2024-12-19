  module.exports.config = {
  name: "trip",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "TANVIR TAMIM",
  description: "BSI GROUP ETC",
  category: "TOOL",
  prefix: false,
  usages: "BSI GROUP TRIP TIME BY TANVIR-143 BOT",
  cooldowns: 5,
  dependencies: {
    "request":"",
    "fs-extra":"",
    "axios":""
  }

};

module.exports.run = async({api,event,args,Users,Threads,Currencies}) => {
const axios = global.nodemodule["axios"];
const request = global.nodemodule["request"];
const fs = global.nodemodule["fs-extra"];
    var link = [
"https://i.imgur.com/n2d41PL.jpeg",
     ];
     var callback = () => api.sendMessage({body:`</> 🥰𝐁𝐒𝐈🇧🇩𝐌𝐔𝐋𝐓𝐘𝐋𝐏𝐋𝐀𝐘𝐄𝐑✅𝐁𝐃\n•This Is Our Official Trip\nTiMe-\n√1️⃣ [12:00] PM 🏖️🥰\n√2️⃣ [03:00] PM🏜️ 😍\n√3️⃣  [10:00] PM🌃☺\n\n♻️GROUP ID \n4730568810395667
---[ADMIN AND MOD]---\n\n
Mayn Uddin Khan [ADMIN]\n unavailable  [MOD]\n🥰😇😍## 𝐁𝐒𝐈🇧🇩🇧🇩𝐌𝐔𝐋𝐓𝐘𝐋𝐏𝐋𝐀𝐘𝐄𝐑✅𝐁𝐃`,attachment: fs.createReadStream(__dirname + "/cache/1.jpg")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.jpg"), event.messageID);  
      return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname+"/cache/1.jpg")).on("close",() => callback());
   };
