const fs = require("fs").promises;
const path = require("path");
const configuration = require("../@configuration");
const exists = require("./exists");

module.exports = async function (key) {
  const keyPath = key.split("/");
  const keyFolders = keyPath.slice(0, -1);
  const keyFile = keyPath.slice(-1);
  const filePath = path.join(
    configuration.rootDataFolder,
    ...keyFolders,
    `${keyFile}.json`
  );

  if (!(await exists(filePath))) {
    return null;
  }

  const rawValue = await fs.readFile(filePath);
  return JSON.parse(rawValue);
};
