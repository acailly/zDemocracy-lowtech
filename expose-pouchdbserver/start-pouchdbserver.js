const express = require("express");

const configuration = require("../@configuration");
const { getPouchDBObject, getDatabase } = require("../@pouchdb");

module.exports = function () {
  console.log("PouchDB server - Starting");

  const app = express();
  app.use(express.urlencoded({ extended: true }));

  const CustomPouchDB = getPouchDBObject();
  app.use("/db", require("express-pouchdb")(CustomPouchDB));
  const db = getDatabase();

  const port = configuration.pouchdbServerPort;
  app.listen(port, () => {
    console.log(
      "PouchDB server - Listening on port",
      port,
      `: http://localhost:${port}`
    );
  });
};
