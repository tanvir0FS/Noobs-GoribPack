const axios = require("axios");

module.exports = {
    config: {
        name: "imgsr",
        version: "1.8.0",
        credits: "♡ Nazrul ♡",
        cooldowns: 10,
        hasPermission: 0,
        description: "Search and fetch images.",
        commandCategory: "image",
    },

    sentImages: [],

    run: async function ({ api, event, args }) {
        const searchTerm = args.join(" ").trim();

        if (!searchTerm) {
            return api.sendMessage("🔰 Please provide a search !\nExample: `/imgsr gojo`",
                event.threadID,
                event.messageID
            );
        }

        try {
            const loadingMessage = await api.sendMessage(`🔰 Searching image for "${searchTerm}" please wait..!!`, event.threadID);
            const response = await axios.get(`https://www.x-noobs-apis.000.pe/nazrul/wallSearch`, {
                params: { query: searchTerm }
            });

            let images = response.data?.data;
            if (!images || images.length === 0) {
                await api.unsendMessage(loadingMessage.messageID);
                return api.sendMessage("❌ No results found!**\nTry a different keyword.", event.threadID, event.messageID);
            }

            images = images.filter(url => !this.sentImages.includes(url));

            if (images.length === 0) {
                await api.unsendMessage(loadingMessage.messageID);
                return api.sendMessage("⚠️  No new images found for this search.**", event.threadID, event.messageID);
            }

            const selectedImages = images.slice(0, 10);

            this.sentImages.push(...selectedImages);

            if (this.sentImages.length >= response.data?.data.length) {
                this.sentImages = [];
            }

            const imageStreams = await Promise.all(selectedImages.map(url => axios.get(url, { responseType: 'stream' }).then(res => res.data)));

            await api.unsendMessage(loadingMessage.messageID);
            await api.sendMessage({
                body: `🔰 Successfully found ${selectedImages.length} image for "${searchTerm}"`,
                attachment: imageStreams
            }, event.threadID, event.messageID);

        } catch (error) {
            console.error(error);
            api.sendMessage(
                `❗ Error fetching images: ${error.message}`,
                event.threadID,
                event.messageID
            );
        }
    },
};
