const axios = require("axios");

module.exports = {
  config: {
    name: "mail",
    version: "1.0",
    author: "ARN",
    cooldown: 8,
    prefix: true,
    category: " gen",
    hasPermission: 0,
    credits: " ARN"
  },

  run: async function ({ api, args, event }) {
    const command = args[0];

    if (command === "new") {
      try {
        const response = await axios.get("https://nethwieginedev.vercel.app/api/tempmail-create?");
        const email = response.data.address;
        return api.sendMessage(`${email}`, event.threadID);
      } catch (error) {
        console.error(error);
        return api.sendMessage("Failed to generate email.", event.threadID);
      }
    } else if (command === "inbox") {
      const email = args[1];

      if (!email) {
        return api.sendMessage("𝖯𝗋𝗈𝗏𝗂𝖽𝖾 𝖺𝗇 𝖾𝗆𝖺𝗂𝗅 𝖺𝖽𝖽𝗋𝖾𝗌𝗌 𝖿𝗈𝗋 𝗍𝗁𝖾 𝗂𝗇𝖻𝗈𝗑.", event.threadID);
      }

   try {
        const inboxResponse = await axios.get(`https://nethwieginedev.vercel.app/api/tempmail-get?email=${email}`);
        const inboxMessages = inboxResponse.data.messages;

        const formattedMessages = inboxMessages.map((message) => {
          return `${message.date} - From: ${message.sender}\n${message.message}`;
        });

        return api.sendMessage(`[🤍] 𝘌𝘮𝘢𝘪𝘭:\n${email}\n[🤍] 𝘐𝘯𝘣𝘰𝘹:👇\n\n${formattedMessages.join("\n\n")}\n\n[🤍] 𝘍𝘪𝘯𝘥 𝘺𝘰𝘶𝘳 𝘤𝘰𝘥𝘦 𝘢𝘣𝘰𝘷𝘦👆`, event.threadID);

      } catch (error) {
        console.error(error);
        return api.sendMessage("𝖥𝖺𝗂𝗅𝖾𝖽 𝗍𝗈 𝗋𝖾𝗍𝗋𝗂𝖾𝗏𝖾 𝗂𝗇𝖻𝗈𝗑 𝗆𝖾𝗌𝗌𝖺𝗀𝖾.", event.threadID);
      }
    } else {
      return api.sendMessage("[💔] 𝘞𝘳𝘰𝘯𝘨...\n[🤍].𝘮𝘢𝘪𝘭 𝘯𝘦𝘸 - 𝘨𝘦𝘵 𝘯𝘦𝘸 𝘮𝘢𝘪𝘭.\n[🤍].𝘮𝘢𝘪𝘭 𝘪𝘯𝘣𝘰𝘹 - 𝘨𝘦𝘵 𝘮𝘢𝘪𝘭 𝘪𝘯𝘣𝘰𝘹.", event.threadID);
    }
  }
};
