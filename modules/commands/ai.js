const axios = require('axios');

module.exports.config = {
  name: "ai",
  version: "0.0.3",
  hasPermssion: 0,
  credits: "Biru",
  description: "Just a bot",
  commandCategory: "ai",
  usePrefix: false,
  usages: "ask anything",
  cooldowns: 5,
  dependencies: { axios: "" }
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;
  const userMessage = args.join(" ");

  // Log the user's message
  console.log("User's Message:", userMessage);

  // Indicate that the bot is processing
  api.setMessageReaction("⌛", messageID, (err) => {}, true);
  api.sendTypingIndicator(threadID, true);

  try {
    // Send the request to the external API
    const apiUrl = `https://vneerapi.onrender.com/ai?prompt=${encodeURIComponent(userMessage)}&uid=${senderID}`;
    const response = await axios.get(apiUrl);

    // Extract the response message
    const responseMessage = response.data.message || "Sorry, I couldn't understand that.";

    // Send the response back to the user
    api.setMessageReaction("✅", messageID, (err) => {}, true);
    api.sendMessage(responseMessage, threadID, (err) => {
      if (err) console.error("Error sending message:", err);

      // Log the bot's response
      console.log("Bot's Response:", responseMessage);
    });
  } catch (error) {
    console.error("Error communicating with the API:", error.message);
    api.sendMessage("I'm busy right now, try again later.", threadID);
  }
};

module.exports.handleReply = async function ({ api, event }) {
  const { threadID, messageID, senderID, body } = event;

  // Log the user's reply
  console.log("User's Reply:", body);

  // Indicate that the bot is processing
  api.sendTypingIndicator(threadID, true);

  try {
    // Send the follow-up request to the external API
    const apiUrl = `https://vneerapi.onrender.com/ai?prompt=${encodeURIComponent(body)}&uid=${senderID}`;
    const response = await axios.get(apiUrl);

    // Extract the response message
    const responseMessage = response.data.message || "Sorry, I couldn't understand that.";

    // Send the response back to the user
    api.sendMessage(responseMessage, threadID, (err) => {
      if (err) console.error("Error sending message:", err);

      // Log the bot's response
      console.log("Bot's Response:", responseMessage);
    });
  } catch (error) {
    console.error("Error communicating with the API:", error.message);
    api.sendMessage("I'm busy right now, try again later.", threadID);
  }
};
