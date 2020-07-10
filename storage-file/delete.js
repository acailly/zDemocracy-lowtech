const fs = require("fs");
const path = require("path");
const configuration = require("../../configuration");

module.exports = function (key) {
  const keyPath = key.split('/')
  const [...keyFolders, keyFile] = keyPath
  const filePath = path.join(configuration.rootDataFolder, ...keyFolders, `${keyFile}.json`)

  if(!fs.existsSync(filePath)){
    return
  }

  fs.unlinkSync(filePath);
};