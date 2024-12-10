const axios = require("axios");
const _ = require("lodash");
const fs = require('fs-extra');
const path = require("path");
const log = require("./logger/log.js");
let chalk;
try {
  chalk = require("./func/colors.js").colors;
} catch (_0x488f58) {
  chalk = require("chalk");
}
const sep = path.sep;
const currentConfig = require('./config.json');
const langCode = currentConfig.language;
const execSync = require("child_process").execSync;
let pathLanguageFile = process.cwd() + '/languages/' + langCode + '.lang';
if (!fs.existsSync(pathLanguageFile)) {
  log.warn("LANGUAGE", "Can't find language file " + langCode + ", using default language file \"" + path.normalize(process.cwd() + '/languages/en.lang') + "\"");
  pathLanguageFile = process.cwd() + "/languages/en.lang";
}
const readLanguage = fs.readFileSync(pathLanguageFile, "utf-8");
const languageData = readLanguage.split(/\r?\n|\r/).filter(_0x590b17 => _0x590b17 && !_0x590b17.trim().startsWith('#') && !_0x590b17.trim().startsWith('//') && _0x590b17 != '');
global.language = {};
for (const sentence of languageData) {
  const getSeparator = sentence.indexOf('=');
  const itemKey = sentence.slice(0x0, getSeparator).trim();
  const itemValue = sentence.slice(getSeparator + 0x1, sentence.length).trim();
  const head = itemKey.slice(0x0, itemKey.indexOf('.'));
  const key = itemKey.replace(head + '.', '');
  const value = itemValue.replace(/\\n/gi, "\n");
  if (!global.language[head]) {
    global.language[head] = {};
  }
  global.language[head][key] = value;
}
function getText(_0x1de3fa, _0x1851a2, ..._0x30ae73) {
  if (!global.language[_0x1de3fa]?.[_0x1851a2]) {
    return "Can't find text: \"" + _0x1de3fa + '.' + _0x1851a2 + "\"";
  }
  let _0x5f188f = global.language[_0x1de3fa][_0x1851a2];
  for (let _0x810f7b = _0x30ae73.length - 0x1; _0x810f7b >= 0x0; _0x810f7b--) {
    _0x5f188f = _0x5f188f.replace(new RegExp('%' + (_0x810f7b + 0x1), 'g'), _0x30ae73[_0x810f7b]);
  }
  return _0x5f188f;
}
const defaultWriteFileSync = fs.writeFileSync;
const defaulCopyFileSync = fs.copyFileSync;
function checkAndAutoCreateFolder(_0x54d18e) {
  const _0x597b14 = path.normalize(_0x54d18e).split(sep);
  let _0x75d634 = '';
  for (const _0x254ba7 in _0x597b14) {
    _0x75d634 += _0x597b14[_0x254ba7] + sep;
    if (!fs.existsSync(_0x75d634)) {
      fs.mkdirSync(_0x75d634);
    }
  }
}
fs.writeFileSync = function (_0x1d6cee, _0x460d5f) {
  _0x1d6cee = path.normalize(_0x1d6cee);
  const _0x2ff881 = _0x1d6cee.split(sep);
  if (_0x2ff881.length > 0x1) {
    _0x2ff881.pop();
  }
  checkAndAutoCreateFolder(_0x2ff881.join(path.sep));
  defaultWriteFileSync(_0x1d6cee, _0x460d5f);
};
fs.copyFileSync = function (_0x5e22a6, _0x1f3052) {
  _0x5e22a6 = path.normalize(_0x5e22a6);
  _0x1f3052 = path.normalize(_0x1f3052);
  const _0x124b9c = _0x1f3052.split(sep);
  if (_0x124b9c.length > 0x1) {
    _0x124b9c.pop();
  }
  checkAndAutoCreateFolder(_0x124b9c.join(path.sep));
  defaulCopyFileSync(_0x5e22a6, _0x1f3052);
};
(async () => {
  const {
    data: _0x187dd6
  } = await axios.get("https://raw.githubusercontent.com/nazrul4x/Noobs-Bot-Pack/main/versions.json");
  const _0xf17bb4 = require('./package.json').version;
  const _0x54d634 = _0x187dd6.findIndex(_0x5256c3 => _0x5256c3.version === _0xf17bb4);
  if (_0x54d634 === -0x1) {
    return log.error("ERROR", getText('updater', "cantFindVersion", chalk.yellow(_0xf17bb4)));
  }
  const _0x84c1b = _0x187dd6.slice(_0x54d634 + 0x1);
  if (_0x84c1b.length === 0x0) {
    return log.info("SUCCESS", getText("updater", "latestVersion"));
  }
  fs.writeFileSync(process.cwd() + "/versions.json", JSON.stringify(_0x187dd6, null, 0x2));
  log.info('UPDATE', getText("updater", "newVersions", chalk.yellow(_0x84c1b.length)));
  const _0xa50a88 = {
    'version': '',
    'files': {},
    'deleteFiles': {},
    'reinstallDependencies': false
  };
  for (const _0x57dda3 of _0x84c1b) {
    for (const _0x535661 in _0x57dda3.files) {
      if (['config.json'].includes(_0x535661)) {
        if (!_0xa50a88.files[_0x535661]) {
          _0xa50a88.files[_0x535661] = {};
        }
        _0xa50a88.files[_0x535661] = {
          ..._0xa50a88.files[_0x535661],
          ..._0x57dda3.files[_0x535661]
        };
      } else {
        _0xa50a88.files[_0x535661] = _0x57dda3.files[_0x535661];
      }
      if (_0x57dda3.reinstallDependencies) {
        _0xa50a88.reinstallDependencies = true;
      }
      if (_0xa50a88.deleteFiles[_0x535661]) {
        delete _0xa50a88.deleteFiles[_0x535661];
      }
      for (const _0x129e1c in _0x57dda3.deleteFiles) _0xa50a88.deleteFiles[_0x129e1c] = _0x57dda3.deleteFiles[_0x129e1c];
      _0xa50a88.version = _0x57dda3.version;
    }
  }
  const _0x519ec1 = process.cwd() + "/backups";
  if (!fs.existsSync(_0x519ec1)) {
    fs.mkdirSync(_0x519ec1);
  }
  const _0x5b85c1 = _0x519ec1 + "/backup_" + _0xf17bb4;
  const _0x2f70f2 = fs.readdirSync(process.cwd()).filter(_0x1f6ccb => _0x1f6ccb.startsWith("backup_") && fs.lstatSync(_0x1f6ccb).isDirectory());
  for (const _0x12ca7d of _0x2f70f2) fs.moveSync(_0x12ca7d, _0x519ec1 + '/' + _0x12ca7d);
  log.info('UPDATE', "Update to version " + chalk.yellow(''));
  const {
    files: _0x5cc541,
    deleteFiles: _0x201f78,
    reinstallDependencies: _0x58db31
  } = _0xa50a88;
  for (const _0x7c1ab9 in _0x5cc541) {
    const _0x16c632 = _0x5cc541[_0x7c1ab9];
    const _0x10ce17 = process.cwd() + '/' + _0x7c1ab9;
    let _0x445a4a;
    try {
      const _0x584716 = await axios.get("https://github.com/Priyansh-11/Priyansh-bot/raw/main/" + _0x7c1ab9, {
        'responseType': "arraybuffer"
      });
      _0x445a4a = _0x584716.data;
    } catch (_0x273543) {
      continue;
    }
    if (['config.json'].includes(_0x7c1ab9)) {
      const _0x33ef66 = JSON.parse(fs.readFileSync(_0x10ce17, 'utf-8'));
      const _0x412fb3 = _0x5cc541[_0x7c1ab9];
      for (const _0x3c04ed in _0x412fb3) {
        const _0x28ba72 = _0x412fb3[_0x3c04ed];
        if (typeof _0x28ba72 == "string" && _0x28ba72.startsWith('DEFAULT_')) {
          const _0x1c489c = _0x28ba72.replace("DEFAULT_", '');
          _.set(_0x33ef66, _0x3c04ed, _.get(_0x33ef66, _0x1c489c));
        } else {
          _.set(_0x33ef66, _0x3c04ed, _0x28ba72);
        }
      }
      if (fs.existsSync(_0x10ce17)) {
        fs.copyFileSync(_0x10ce17, _0x5b85c1 + '/' + _0x7c1ab9);
      }
      fs.writeFileSync(_0x10ce17, JSON.stringify(_0x33ef66, null, 0x2));
      console.log(chalk.bold.blue("[↑]"), _0x7c1ab9);
      console.log(chalk.bold.yellow("[!]"), getText("updater", "configChanged", chalk.yellow(_0x7c1ab9)));
    } else {
      const _0x1a067a = ["DO NOT UPDATE", "SKIP UPDATE", "DO NOT UPDATE THIS FILE"];
      const _0x394c7b = fs.existsSync(_0x10ce17);
      if (_0x394c7b) {
        fs.copyFileSync(_0x10ce17, _0x5b85c1 + '/' + _0x7c1ab9);
      }
      const _0xf99c0c = _0x394c7b ? fs.readFileSync(_0x10ce17, "utf-8").trim().split(/\r?\n|\r/)[0x0] : '';
      const _0x5aa685 = _0x1a067a.findIndex(_0x375b5b => _0xf99c0c.includes(_0x375b5b));
      if (_0x5aa685 !== -0x1) {
        console.log(chalk.bold.yellow("[!]"), getText("updater", 'skipFile', chalk.yellow(_0x7c1ab9), chalk.yellow(_0x1a067a[_0x5aa685])));
        continue;
      } else {
        fs.writeFileSync(_0x10ce17, Buffer.from(_0x445a4a));
        if (_0x394c7b) {
          console.log(chalk.bold.blue("[↑]"), _0x7c1ab9 + ':', chalk.hex('#858585')(typeof _0x16c632 == "string" ? _0x16c632 : typeof _0x16c632 == "object" ? JSON.stringify(_0x16c632, null, 0x2) : _0x16c632));
        } else {
          console.log(chalk.bold.green("[+]"), _0x7c1ab9 + ':', chalk.hex('#858585')(typeof _0x16c632 == "string" ? _0x16c632 : typeof _0x16c632 == "object" ? JSON.stringify(_0x16c632, null, 0x2) : _0x16c632));
        }
      }
    }
  }
  for (const _0xf24d42 in _0x201f78) {
    const _0x12eafb = _0x201f78[_0xf24d42];
    const _0x36e641 = process.cwd() + '/' + _0xf24d42;
    if (fs.existsSync(_0x36e641)) {
      if (fs.lstatSync(_0x36e641).isDirectory()) {
        fs.removeSync(_0x36e641);
      } else {
        fs.copyFileSync(_0x36e641, _0x5b85c1 + '/' + _0xf24d42);
        fs.unlinkSync(_0x36e641);
      }
      console.log(chalk.bold.red("[-]"), _0xf24d42 + ':', chalk.hex("#858585")(_0x12eafb));
    }
  }
  const {
    data: _0x24fa9e
  } = await axios.get('https://github.com/nazrul4x/Noobs-Bot-Pack/blob/main/package.json');
  const _0x529994 = _0x24fa9e.split("data-target=\"react-app.embeddedData\">")[0x1].split("</script>")[0x0];
  const _0x5937d1 = JSON.parse(_0x529994).payload.blob.rawLines.join("\n");
  fs.writeFileSync(process.cwd() + "/package.json", JSON.stringify(JSON.parse(_0x5937d1), null, 0x2));
  log.info("UPDATE", getText("updater", "updateSuccess", !_0x58db31 ? getText("updater", "restartToApply") : ''));
  if (_0x58db31) {
    log.info("UPDATE", getText("updater", 'installingPackages'));
    execSync("npm install", {
      'stdio': 'inherit'
    });
    log.info("UPDATE", getText('updater', "installSuccess"));
  }
  log.info('UPDATE', getText("updater", "backupSuccess", chalk.yellow(_0x5b85c1)));
})();
