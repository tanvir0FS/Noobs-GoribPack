const { writeFileSync, existsSync } = require('fs-extra');
const { resolve } = require("path");
const request = require("request");

module.exports.config = {
    name: "admin",
    version: "1.0.5",
    hasPermission: 0,
    credits: "",
    description: "Admin Config",
    commandCategory: "Admin",
    usages: "Admin",
    cooldowns: 2,
    dependencies: {
        "fs-extra": ""
    }
};

module.exports.languages = {
    "en": {
        "listAdmin": '[Admin] Admin list: \n\n%1',
        "notHavePermission": '[Admin] You have no permission to use "%1"',
        "addedNewAdmin": '[Admin] Added %1 Admin :\n\n%2',
        "removedAdmin": '[Admin] Removed %1 Admin:\n\n%2'
    }
};

module.exports.onLoad = function () {
    const path = resolve(__dirname, 'cache', 'data.json');
    if (!existsSync(path)) {
        const obj = {
            adminbox: {}
        };
        writeFileSync(path, JSON.stringify(obj, null, 4));
    } else {
        const data = require(path);
        if (!data.hasOwnProperty('adminbox')) data.adminbox = {};
        writeFileSync(path, JSON.stringify(data, null, 4));
    }
};

module.exports.run = async function ({ api, event, args, Users, permission, getText }) {
    const content = args.slice(1);
    const { threadID, messageID, mentions } = event;
    const { configPath } = global.client;
    const { ADMINBOT } = global.config;
    const { NDH } = global.config;
    const { writeFileSync } = global.nodemodule["fs-extra"];
    const mention = Object.keys(mentions);

    delete require.cache[require.resolve(configPath)];
    var config = require(configPath);

    if (args.length === 0) {
        return api.sendMessage({
            body: `==== [ Admin SETTINGS ] ====
━━━━━━━━━━━━━━━
MODE - admin list => View list of Admin and Support
MODE - admin add => Add user as Admin
MODE - admin remove => Remove Admin role
MODE - admin addndh => Add user as Support
MODE - admin removendh => Remove Support role
MODE - admin qtvonly => Toggle mode allowing only admins to use bot
MODE - admin ndhonly => Toggle mode allowing only support to use bot
MODE - admin only => Toggle mode allowing only admins to use bot
MODE - admin ibonly => Toggle mode allowing only admins to use bots in inbox separately from bots
━━━━━━━━━━━━━━━
HDSD => ${global.config.PREFIX}admin commands to use`
        }, threadID, messageID);
    }

    switch (args[0]) {
        case "list":
        case "all":
        case "-a":
            let listAdmin = ADMINBOT || config.ADMINBOT || [];
            let msg = [];
            for (const idAdmin of listAdmin) {
                if (parseInt(idAdmin)) {
                    const name = (await Users.getData(idAdmin)).name;
                    msg.push(`Name: ${name}\n» Facebook Link: https://www.facebook.com/${idAdmin} 💌`);
                }
            }

            let listNDH = NDH || config.NDH || [];
            let msg1 = [];
            for (const idNDH of listNDH) {
                if (parseInt(idNDH)) {
                    const name1 = (await Users.getData(idNDH)).name;
                    msg1.push(`Name: ${name1}\n» Facebook Link: https://www.facebook.com/${idNDH} 🤖`);
                }
            }

            return api.sendMessage(getText("listAdmin", msg.join("\n\n"), msg1.join("\n\n")), threadID, messageID);

        case "add":
            if (event.senderID != 100037743553265) return api.sendMessage(`MODE - Border change rights 🎀 `, threadID, messageID);
            if (permission !== 3) return api.sendMessage(getText("notHavePermission", "add"), threadID, messageID);

            if (event.type === "message_reply") {
                content[0] = event.messageReply.senderID;
            }

            if (mention.length !== 0 && isNaN(content[0])) {
                const listAdd = [];

                for (const id of mention) {
                    ADMINBOT.push(id);
                    config.ADMINBOT.push(id);
                    listAdd.push(`${id} - ${event.mentions[id]}`);
                }

                writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return api.sendMessage(getText("addedNewAdmin", mention.length, listAdd.join("\n").replace(/\@/g, "")), threadID, messageID);
            } else if (content.length !== 0 && !isNaN(content[0])) {
                ADMINBOT.push(content[0]);
                config.ADMINBOT.push(content[0]);
                const name = (await Users.getData(content[0])).name;
                writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return api.sendMessage(getText("addedNewAdmin", 1, `Admin - ${name}`), threadID, messageID);
            } else {
                return global.utils.throwError(this.config.name, threadID, messageID);
            }

        case "addndh":
            if (event.senderID != 100049220893428) return api.sendMessage(`MODE - Border change rights 🎀 `, threadID, messageID);
            if (permission !== 3) return api.sendMessage(getText("notHavePermission", "addndh"), threadID, messageID);

            if (event.type === "message_reply") {
                content[0] = event.messageReply.senderID;
            }

            if (mention.length !== 0 && isNaN(content[0])) {
                const listAdd = [];

                for (const id of mention) {
                    NDH.push(id);
                    config.NDH.push(id);
                    listAdd.push(`${id} - ${event.mentions[id]}`);
                }

                writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return api.sendMessage(getText("addedNewNDH", mention.length, listAdd.join("\n").replace(/\@/g, "")), threadID, messageID);
            } else if (content.length !== 0 && !isNaN(content[0])) {
                NDH.push(content[0]);
                config.NDH.push(content[0]);
                const name = (await Users.getData(content[0])).name;
                writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return api.sendMessage(getText("addedNewNDH", 1, `Supporters - ${name}`), threadID, messageID);
            } else {
                return global.utils.throwError(this.config.name, threadID, messageID);
            }

        case "remove":
        case "rm":
        case "delete":
            if (event.senderID != 100049220893428) return api.sendMessage(`MODE - Border change rights 🎀 `, threadID, messageID);
            if (permission !== 3) return api.sendMessage(getText("notHavePermission", "delete"), threadID, messageID);

            if (event.type === "message_reply") {
                content[0] = event.messageReply.senderID;
            }

            if (mention.length !== 0 && isNaN(content[0])) {
                const listAdd = [];

                for (const id of mention) {
                    const index = config.ADMINBOT.findIndex(item => item === id);
                    if (index !== -1) {
                        ADMINBOT.splice(index, 1);
                        config.ADMINBOT.splice(index, 1);
                        listAdd.push(`${id} - ${event.mentions[id]}`);
                    }
                }

                writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return api.sendMessage(getText("removedAdmin", mention.length, listAdd.join("\n").replace(/\@/g, "")), threadID, messageID);
            } else if (content.length !== 0 && !isNaN(content[0])) {
                const index = config.ADMINBOT.findIndex(item => item.toString() === content[0]);
                if (index !== -1) {
                    ADMINBOT.splice(index, 1);
                    config.ADMINBOT.splice(index, 1);
                    const name = (await Users.getData(content[0])).name;
                    writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                    return api.sendMessage(getText("removedAdmin", 1, `${content[0]} - ${name}`), threadID, messageID);
                }
            } else {
                return global.utils.throwError(this.config.name, threadID, messageID);
            }

        case "removendh":
            if (event.senderID != 100049220893428) return api.sendMessage(`MODE - Border change rights 🎀 `, threadID, messageID);
            if (permission !== 3) return api.sendMessage(getText("notHavePermission", "removendh"), threadID, messageID);

            if (event.type === "message_reply") {
                content[0] = event.messageReply.senderID;
            }

            if (mention.length !== 0 && isNaN(content[0])) {
                const listAdd = [];

                for (const id of mention) {
                    const index = config.NDH.findIndex(item => item === id);
                    if (index !== -1) {
                        NDH.splice(index, 1);
                        config.NDH.splice(index, 1);
                        listAdd.push(`${id} - ${event.mentions[id]}`);
                    }
                }

                writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return api.sendMessage(getText("removedAdmin", mention.length, listAdd.join("\n").replace(/\@/g, "")), threadID, messageID);
            } else if (content.length !== 0 && !isNaN(content[0])) {
                const index = config.NDH.findIndex(item => item.toString() === content[0]);
                if (index !== -1) {
                    NDH.splice(index, 1);
                    config.NDH.splice(index, 1);
                    const name = (await Users.getData(content[0])).name;
                    writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                    return api.sendMessage(getText("removedAdmin", 1, `${content[0]} - ${name}`), threadID, messageID);
                }
            } else {
                return global.utils.throwError(this.config.name, threadID, messageID);
            }

        case 'qtvonly':
            if (permission !== 3) return api.sendMessage("MODE - Border change rights", threadID, messageID);
            config.qtvOnly = !config.qtvOnly;
            api.sendMessage(config.qtvOnly ? "MODE » Successfully enabled QTV Only mode, only QTV members can use the bot" : "MODE » Successfully disabled QTV Only mode, effective for all bot users", threadID, messageID);
            writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
            break;

        case 'ibonly':
            if (permission !== 3) return api.sendMessage("MODE - Border change rights", threadID, messageID);
            config.adminPaOnly = !config.adminPaOnly;
            api.sendMessage(config.adminPaOnly ? "MODE » Successfully enabled IB Only mode, only admins can use bots in IB" : "MODE » Successfully disabled IB Only mode, effective for all bot users", threadID, messageID);
            writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
            break;
    }
};
