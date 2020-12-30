const path = require("path");
const os = require("os");

const homeDirectory = path.join(os.homedir(), ".zDemocracy");

// IDENTITY UUID
const identityKey = "_local/identity";

// STORAGE FILE
const localStorageFolder = path.join(homeDirectory, "data");

// STORAGE POUCHDB
const localDatabaseName = "storage";
const localDatabaseFolder = path.join(homeDirectory, "db");

// APP ZDEMOCRACY
const zdemocracyServerPort = 8080;

// APP LIST
const listServerPort = 8082;

// APP NEWS
const newsServerPort = 8092;

// SYNCHRONIZATION GIT
const syncGitEnabled = true;
const useNativeGit = true;
const gitSyncPeriodInMs = 20000;
const localSubfoldersToSync = ["news/_deleted_flag", "news/feeds"];
const repositoriesStorageKey = "repositories";

// SYNCHRONIZATION POUCHDB
const syncPouchDBEnabled = true;
const remoteListKey = "_local/remotes";
const pouchdbSyncPeriodInMs = 20000;

// EXPOSE GIT DUMB HTTP
const gitDumbHttpPort = 8081;

// EXPOSE POUCHDB SERVER
const pouchdbServerPort = 5984;

// EXPOSE LOCALTUNNEL
// See https://github.com/localtunnel/localtunnel/issues/343
// See https://github.com/localtunnel/localtunnel/issues/352#issuecomment-707417061
const tunnellingHost = "http://localtunnel.me";
const tunnellingLocalPort = 8081;

// DISTRIB BROWSER
const deployBaseURL = "/zDemocracy-lowtech";

const configuration = {
  identityKey,
  localStorageFolder,
  localDatabaseName,
  localDatabaseFolder,
  zdemocracyServerPort,
  listServerPort,
  newsServerPort,
  syncGitEnabled,
  useNativeGit,
  gitSyncPeriodInMs,
  localSubfoldersToSync,
  repositoriesStorageKey,
  syncPouchDBEnabled,
  remoteListKey,
  pouchdbSyncPeriodInMs,
  gitDumbHttpPort,
  pouchdbServerPort,
  tunnellingHost,
  tunnellingLocalPort,
  deployBaseURL,
};

module.exports = configuration;

// TO NOT FORGET: examples of git repositories

// const repositoriesToSync = [
//   {
//     name: "github",
//     branch: "master",
//     // remoteRepository: "git@github.com:acailly/zDemocracy-lowtech-data.git",
//     remoteRepository: "https://github.com/acailly/zDemocracy-lowtech-data.git",
//     enablePush: true,
//   },
//   {
//     name: "desktop",
//     branch: "master",
//     remoteRepository:
//       "https://a9f28f2e-bdbe-42b5-a451-7f855e7aa091.serverless.social",
//     enablePush: false,
//   },
//   {
//     name: "mobile",
//     branch: "master",
//     remoteRepository:
//       "https://0e9c59c1-ce1a-4c49-9b39-b475adeb9032.serverless.social",
//     enablePush: false,
//   },
// ];
