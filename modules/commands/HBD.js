module.exports.config = {
  name: "hbd",
  version: "1.0.0",
  prefix: true,
  hasPermssion: 0,
  credits: "khá»‘n kiáº¿p tÃªn trá»™m",
  description: "prank friends",
  category: "Group",
  usages: "@tag",
  dependencies: {
    axios: "",
    "fs-extra": ""
  },
  cooldowns: 0
};
module.exports.wrapText = (_0x29978c, _0x4ad966, _0x4d5f11) => {
  return new Promise(_0x7f5072 => {
    if (_0x29978c.measureText(_0x4ad966).width < _0x4d5f11) {
      return _0x7f5072([_0x4ad966]);
    }
    if (_0x29978c.measureText("W").width > _0x4d5f11) {
      return _0x7f5072(null);
    }
    const _0x7ffe5b = _0x4ad966.split(" ");
    const _0x8a7eec = [];
    let _0x52efd0 = "";
    while (_0x7ffe5b.length > 0) {
      let _0x2ddbdd = false;
      while (_0x29978c.measureText(_0x7ffe5b[0]).width >= _0x4d5f11) {
        const _0x177fef = _0x7ffe5b[0];
        _0x7ffe5b[0] = _0x177fef.slice(0, -1);
        if (_0x2ddbdd) {
          _0x7ffe5b[1] = "" + _0x177fef.slice(-1) + _0x7ffe5b[1];
        } else {
          _0x2ddbdd = true;
          _0x7ffe5b.splice(1, 0, _0x177fef.slice(-1));
        }
      }
      if (_0x29978c.measureText("" + _0x52efd0 + _0x7ffe5b[0]).width < _0x4d5f11) {
        _0x52efd0 += _0x7ffe5b.shift() + " ";
      } else {
        _0x8a7eec.push(_0x52efd0.trim());
        _0x52efd0 = "";
      }
      if (_0x7ffe5b.length === 0) {
        _0x8a7eec.push(_0x52efd0.trim());
      }
    }
    return _0x7f5072(_0x8a7eec);
  });
};
module.exports.run = async function ({
  args: _0x23530f,
  Users: _0x36d5ac,
  Threads: _0x16ef3b,
  api: _0x1ee445,
  event: _0x10bfb0,
  Currencies: _0x558a01
}) {
  const {
    loadImage: _0x4babdc,
    createCanvas: _0x2258da
  } = require("canvas");
  const _0x285964 = global.nodemodule["fs-extra"];
  const _0x1743af = global.nodemodule.axios;
  let _0x3af5c6 = __dirname + "/cache/background.png";
  let _0x366e3f = __dirname + "/cache/Avtmot.png";
  var _0x5a0182 = Object.keys(_0x10bfb0.mentions)[0] || _0x10bfb0.senderID;
  var _0x1a030b = await _0x36d5ac.getNameUser(_0x5a0182);
  var _0x7259a7 = ["https://i.postimg.cc/FKDmwQY2/20241217-013952.png"];
  var _0xcb8b46 = _0x7259a7[Math.floor(Math.random() * _0x7259a7.length)];
  let _0x2ac756 = (await _0x1743af.get("https://graph.facebook.com/" + _0x5a0182 + "/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662", {
    responseType: "arraybuffer"
  })).data;
  _0x285964.writeFileSync(_0x366e3f, Buffer.from(_0x2ac756, "utf-8"));
  let _0x163ded = (await _0x1743af.get("" + _0xcb8b46, {
    responseType: "arraybuffer"
  })).data;
  _0x285964.writeFileSync(_0x3af5c6, Buffer.from(_0x163ded, "utf-8"));
  let _0x59b020 = await _0x4babdc(_0x3af5c6);
  let _0x2338e9 = await _0x4babdc(_0x366e3f);
  let _0x262bd7 = _0x2258da(_0x59b020.width, _0x59b020.height);
  let _0xcc1c8c = _0x262bd7.getContext("2d");
  _0xcc1c8c.drawImage(_0x59b020, 0, 0, _0x262bd7.width, _0x262bd7.height);
  _0xcc1c8c.font = "00 0px Arial";
  _0xcc1c8c.fillStyle = "#1878F3";
  _0xcc1c8c.textAlign = "start";
  const _0x3d624d = await this.wrapText(_0xcc1c8c, _0x1a030b, 1160);
  _0xcc1c8c.fillText(_0x3d624d.join("\n"), 0, 0);
  _0xcc1c8c.beginPath();
  _0xcc1c8c.drawImage(_0x2338e9, 70, 270, 400, 400);
  const _0x33b1a8 = _0x262bd7.toBuffer();
  _0x285964.writeFileSync(_0x3af5c6, _0x33b1a8);
  _0x285964.removeSync(_0x366e3f);
  return _0x1ee445.sendMessage({
    body: "Happy Birthday " + _0x1a030b + "💙\n★___________________________★\n সুন্দর হোক তোমার আগামী দিনের পথচলা🥰🤍____✨🪄 \n\n ✨__ভালোবাসায় রঙ্গিন হোক তোমার এ জীবন🌸 \n\nদোয়া করি তোমার দুঃখ কষ্ট সমাপ্তি হোক__✨😫\n🤲✨___স্বপ্ন গুলো পূরন হোক , \n শুভ জন্মদিন " + _0x1a030b + "✨😘\n\n-by " + global.config.BOTNAME + " (BOT) ",
    attachment: _0x285964.createReadStream(_0x3af5c6)
  }, _0x10bfb0.threadID, () => _0x285964.unlinkSync(_0x3af5c6), _0x10bfb0.messageID);
};
