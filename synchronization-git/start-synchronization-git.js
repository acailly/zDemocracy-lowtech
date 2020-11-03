const path = require("path");
const fs = require("fs");
const mkdirp = require("mkdirp");
const configuration = require("../@configuration");
const loadGit = require("./loadGit");

module.exports = async function () {
  if (!configuration.syncEnabled) {
    console.log("[synchronization-git] Synchronization is disabled");
    return;
  }

  const git = await loadGit();
  await initializeGitRepositoryIfNecessary(
    git,
    configuration.localStorageFolder
  );

  for (
    let repositoryIndex = 0;
    repositoryIndex < configuration.repositoriesToSync.length;
    repositoryIndex++
  ) {
    const repository = configuration.repositoriesToSync[repositoryIndex];
    await registerRemoteRepositoryIfNecessary(
      git,
      configuration.localStorageFolder,
      repository
    );
  }

  await sync(
    git,
    configuration.localStorageFolder,
    configuration.localSubfoldersToSync,
    configuration.repositoriesToSync
  );
  setInterval(async () => {
    await sync(
      git,
      configuration.localStorageFolder,
      configuration.localSubfoldersToSync,
      configuration.repositoriesToSync
    );
  }, configuration.gitSyncPeriodInMs || 10000);
};

async function initializeGitRepositoryIfNecessary(git, localStorageFolder) {
  // Check that the local storage folder exists

  if (!fs.existsSync(localStorageFolder)) {
    console.log(
      "[synchronization-git] Local storage folder doesn't exist, create it"
    );
    mkdirp.sync(localStorageFolder);
  }

  // Check that the git repository exists

  const gitRepositoryPath = path.join(localStorageFolder, ".git");
  if (!fs.existsSync(gitRepositoryPath)) {
    console.log("[synchronization-git] Git repository doesn't exist, init it");
    await git.init(localStorageFolder);
  }
}

async function registerRemoteRepositoryIfNecessary(
  git,
  localStorageFolder,
  repository
) {
  const url = await git.getRemoteUrl(localStorageFolder, repository.name);
  if (!url) {
    console.log(
      "[synchronization-git] Remote repository doesn't exist, add it"
    );
    await git.addRemote(
      localStorageFolder,
      repository.name,
      repository.remoteRepository
    );
  }
}

async function sync(
  git,
  localStorageFolder,
  localSubfoldersToSync,
  repositories
) {
  console.log(
    "[synchronization-git] Starting to synchronize on git:",
    localStorageFolder
  );

  await commitCurrentChanges(git, localStorageFolder, localSubfoldersToSync);

  await updateServerInfo(git, localStorageFolder);

  for (
    let repositoryIndex = 0;
    repositoryIndex < repositories.length;
    repositoryIndex++
  ) {
    const repository = repositories[repositoryIndex];

    if (!(await canFetchRepository(git, localStorageFolder, repository))) {
      continue;
    }

    await pullRemoteChanges(git, localStorageFolder, repository);
    if (repository.enablePush) {
      await pushLocalChanges(git, localStorageFolder, repository);
    }
  }

  await updateServerInfo(git, localStorageFolder);

  console.log("[synchronization-git] Finished");
}

async function commitCurrentChanges(
  git,
  localStorageFolder,
  localSubfoldersToSync
) {
  for (const localSubfolder of localSubfoldersToSync) {
    console.log("[synchronization-git] Add subfolder:", localSubfolder);
    await git.add(localStorageFolder, localSubfolder);
  }

  const somethingToCommit = await git.somethingToCommit(localStorageFolder);
  if (somethingToCommit) {
    console.log("[synchronization-git] Commit");
    await git.commit(localStorageFolder);
  } else {
    console.log("[synchronization-git] No local changes");
  }
}

async function updateServerInfo(git, localStorageFolder) {
  console.log("[synchronization-git] Update server info");
  await git.updateServerInfo(localStorageFolder);
}

async function canFetchRepository(git, localStorageFolder, repository) {
  console.log("[synchronization-git] Can fetch", repository.name, "?");
  const canFetch = await git.canFetchRemote(
    localStorageFolder,
    repository.name,
    repository.remoteRepository,
    repository.branch
  );
  console.log("[synchronization-git]", canFetch ? "Yes" : "No");
  return canFetch;
}

async function pullRemoteChanges(git, localStorageFolder, repository) {
  console.log("[synchronization-git] Fetch repository:", repository.name);
  await git.fetch(localStorageFolder, repository.name, repository.branch);

  console.log("[synchronization-git] Merge repository:", repository.name);
  await git.merge(localStorageFolder, repository.name, repository.branch);
}

async function pushLocalChanges(git, localStorageFolder, repository) {
  console.log("[synchronization-git] Push to repository:", repository.name);
  await git.push(localStorageFolder, repository.name, repository.branch);
}
