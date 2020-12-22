const git = require("isomorphic-git");
const fs = require("fs");

// Warning: This method has proved itself very slow when there is many files to check (in my case, 5000+)
module.exports = async (folder, files) => {
  // From snippet https://isomorphic-git.org/docs/en/snippets#git-add-a-
  // Using wonderful command statusMatrix
  // See more at https://isomorphic-git.org/docs/en/statusMatrix.html
  await git
    .statusMatrix({
      fs,
      dir: folder,
      filepaths: [files],
    })
    .then((status) =>
      Promise.all(
        status.map(([FILE, HEAD, WORKDIR, STAGE]) => {
          return WORKDIR
            ? git.add({ fs, dir: folder, filepath: FILE })
            : git.remove({ fs, dir: folder, filepath: FILE });
        })
      )
    );
};
