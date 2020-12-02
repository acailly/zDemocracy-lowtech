const path = require("path");
const fs = require("fs");
const execSync = require("child_process").execSync;

const express = require("express");

const configuration = require("../@configuration");

module.exports = function () {
  console.log("Git dumb http server - Starting");

  if (!fs.existsSync(configuration.localStorageFolder)) {
    console.log(
      "Git dumb http server - Storage folder doesn't exist, create it"
    );
    makeDir.sync(configuration.localStorageFolder);
  }

  const gitRepositoryPath = path.join(configuration.localStorageFolder, ".git");
  if (!fs.existsSync(gitRepositoryPath)) {
    console.log("Git dumb http server - Git repository doesn't exist, init it");
    execSync(`git init`, {
      cwd: configuration.localStorageFolder,
    });
  }

  // Create the hook if it doesn't exists
  const gitRepository = path.join(configuration.localStorageFolder, ".git");
  const hookFile = path.join(gitRepository, "hooks", "post-update");
  if (!fs.existsSync(hookFile)) {
    console.log(
      "Git dumb http server - Post-update hook doesn't exist, create it"
    );
    const hookFileSample = path.join(
      gitRepository,
      "hooks",
      "post-update.sample"
    );
    fs.copyFileSync(hookFileSample, hookFile);

    // Update server info
    execSync("git update-server-info", {
      cwd: gitRepository,
    });
  }

  const app = express();
  app.use(express.urlencoded({ extended: true }));

  app.use(express.static(path.join(configuration.localStorageFolder, ".git")));

  console.log(
    "Git dumb http server - Listening on port",
    configuration.gitDumbHttpPort
  );
  app.listen(configuration.gitDumbHttpPort);
};
