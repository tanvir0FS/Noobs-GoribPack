const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
    config: {
        name: "ytb",
        version: "1.6.9",
        credits: "Nazrul",
        cooldowns: 8,
        hasPermission: 0,
        description: "Search or Download YouTube Audio or Video",
        commandCategory: "Media",
        usage: "use /ytb a/audio or v/video for search, or d a/audio or v/video for download."
    },
    run: async function ({ api, event, args }) {
        const mediaOption = args.shift().toLowerCase(); // a/audio, v/video, or d
        const mediaQuery = args.join(" ").trim();
        const isUrl = mediaQuery.startsWith('https://') || mediaQuery.startsWith('http://');

        // Check if the mediaOption is valid (audio, video, or download option)
        if (!["a", "audio", "v", "video", "d"].includes(mediaOption)) {
            return api.sendMessage("🎀 Please specify 'a' or 'audio' for audio, 'v' or 'video' for video, or 'd' for download!", event.threadID, event.messageID);
        }

        if (mediaOption === 'd') {
            // Handle the download directly without searching
            if (!isUrl) {
                return api.sendMessage("🎀 Please provide a valid YouTube URL for download.", event.threadID, event.messageID);
            }
            const type = args[0]?.toLowerCase(); // Check if it's audio or video
            if (!["a", "audio", "v", "video"].includes(type)) {
                return api.sendMessage("🎀 Please specify 'a' or 'audio' for audio, 'v' or 'video' for download.", event.threadID, event.messageID);
            }
            await this.downloadMedia(api, event, type, mediaQuery);
        } else {
            // For searching media (audio or video)
            if (isUrl) {
                await this.downloadMedia(api, event, mediaOption, mediaQuery);
            } else if (mediaQuery.length > 0) {
                await this.searchMedia(api, event, mediaOption, mediaQuery);
            } else {
                api.sendMessage("🎀 Please provide a Search Name or YouTube URL!", event.threadID, event.messageID);
            }
        }
    },

    downloadMedia: async function (api, event, mediaType, mediaUrl, mediaTitle, mediaDuration) {
        try {
            const apiUrl = mediaType === "a" || mediaType === "audio"
                ? `https://ytdl-api-production.up.railway.app/nazrul/ytDL?url=${encodeURIComponent(mediaUrl)}&type=mp3&quality=128kbps`
                : `https://ytdl-api-production.up.railway.app/nazrul/ytDL?url=${encodeURIComponent(mediaUrl)}&type=mp4&quality=360p`;

            const res = await axios.get(apiUrl);
            const mediaData = res.data;

            if (!mediaData.d_url) {
                throw new Error('Download link not found!');
            }

            const fileName = mediaType === "a" || mediaType === "audio" ? 'audio.mp3' : 'video.mp4';
            const mediaPath = path.resolve(__dirname, fileName);
            const writer = fs.createWriteStream(mediaPath);
            const mediaStream = (await axios.get(mediaData.d_url, { responseType: 'stream' })).data;

            mediaStream.pipe(writer);

            writer.on('finish', () => {
                api.sendMessage({
                    body: `✅✨ ♡ 𝐓𝐢𝐭𝐥𝐞: ${mediaData.title}\n♡ 𝐃𝐮𝐫𝐚𝐭𝐢𝐨𝐧: ${mediaDuration || "Unknown"}\n`,
                    attachment: fs.createReadStream(mediaPath)
                }, event.threadID, () => fs.unlinkSync(mediaPath), event.messageID);
            });

            writer.on('error', (error) => {
                console.error('Error downloading the media:', error);
                api.sendMessage(`❌ Error: ${error.message}`, event.threadID, event.messageID);
            });

        } catch (error) {
            console.error('An error occurred:', error.message);
            api.sendMessage(`❌ Error: ${error.message}`, event.threadID, event.messageID);
        }
    },

    searchMedia: async function (api, event, mediaType, query) {
        if (!query) {
            return api.sendMessage("🎀 Please provide a Song Name!", event.threadID, event.messageID);
        }

        try {
            const msg = await api.sendMessage(`🎵 Searching for the ${mediaType === "a" || mediaType === "audio" ? "audio" : "video"} [ ${query} ]✨..!`, event.threadID);

            const res = await axios.get(`https://www.x-noobs-apis.000.pe/nazrul/ytSearch?query=${encodeURIComponent(query)}`);
            const searchData = res.data;

            if (!searchData || searchData.length === 0) {
                throw new Error('No results found for your query!');
            }

            const maxResults = Math.min(searchData.length, 10);
            let replyMessage = `✅ Here are the top search results for ${mediaType === "a" || mediaType === "audio" ? "audio" : "video"}:\n\n`;

            for (let i = 0; i < maxResults; i++) {
                const media = searchData[i];
                replyMessage += `🎵 ${mediaType === "a" || mediaType === "audio" ? "Song" : "Video"} #${i + 1}:\n`;
                replyMessage += `👑 Title: ${media.title}\n`;
                replyMessage += `⏰ Duration: ${media.timestamp}\n\n`;
            }

            api.sendMessage(replyMessage, event.threadID, (error, info) => {
                if (!error) {
                    global.client.handleReply.push({
                        name: this.config.name,
                        type: "reply",
                        messageID: info.messageID,
                        author: event.senderID,
                        searchData: searchData,
                        mediaType: mediaType
                    });
                }
            }, event.messageID);

            await api.unsendMessage(msg.messageID);
        } catch (error) {
            console.error('An error occurred:', error.message);
            api.sendMessage(`❌ Error: ${error.message}`, event.threadID, event.messageID);
        }
    },

    handleReply: async function ({ api, event, handleReply }) {
        try {
            const choice = parseInt(event.body.trim());
            const { searchData, mediaType } = handleReply;

            api.unsendMessage(handleReply.messageID);

            if (isNaN(choice) || choice < 1 || choice > searchData.length) {
                return api.sendMessage("🎀 Invalid choice. Please reply with the number of the search result.", event.threadID, event.messageID);
            }

            const selectedMedia = searchData[choice - 1];
            const mediaUrl = selectedMedia.url;

            await this.downloadMedia(api, event, mediaType, mediaUrl, selectedMedia.title, selectedMedia.timestamp);
        } catch (error) {
            console.error('An error occurred:', error.message);
            api.sendMessage(`❌ Error: ${error.message}`, event.threadID, event.messageID);
        }
    }
};
