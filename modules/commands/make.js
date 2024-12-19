module.exports.config = {
  name: "make",
  version: "1.0.",
  permission: 0,
  credits: "jameslim",
  description: "generate image from polination",
  prefix: false,
  category: "image",
  usages: "query",
  cooldowns: 5,
};

module.exports.run = async ({api, event, args }) => {
const axios = require('axios');
const fs = require('fs-extra');
 let { threadID, messageID } = event;
  let query = args.join(" ");
  if (!query) return api.sendMessage("[🤍] 𝘗𝘭𝘦𝘢𝘴𝘦 𝘱𝘳𝘰𝘷𝘪𝘥𝘦 𝘺𝘰𝘶𝘳 𝘱𝘳𝘰𝘮𝘰𝘵𝘦.", threadID, messageID);
  api.sendMessage("[🤍] 𝘐𝘮𝘢𝘨𝘦 𝘨𝘦𝘯𝘦𝘳𝘢𝘵𝘪𝘯𝘨,  𝘸𝘢𝘪𝘵...",event.threadID, event.messageID);
let path = __dirname + `/cache/poli.png`;
  const poli = (await axios.get(`https://image.pollinations.ai/prompt/${query}`, {
    responseType: "arraybuffer",
  })).data;
  fs.writeFileSync(path, Buffer.from(poli, "utf-8"));
  api.sendMessage({
    body: `[🤍] 𝘐𝘮𝘢𝘨𝘦 𝘎𝘦𝘯𝘦𝘳𝘢𝘵𝘦𝘥 𝘚𝘶𝘤𝘤𝘦𝘴𝘴𝘧𝘶𝘭`,
    attachment: fs.createReadStream(path) }, threadID, () => fs.unlinkSync(path), messageID);
};
