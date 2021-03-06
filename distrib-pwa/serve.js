const path = require("path");
const express = require("express");
const configuration = require("../@configuration");

async function serve() {
  const outputPath = path.join(__dirname, "..", "output", "distrib-pwa");

  const app = express();
  app.use(express.urlencoded({ extended: true }));

  app.use(express.static(outputPath));

  const port = 7777;

  app.listen(port, () => {
    const baseUrl = configuration.deployBaseURL || "";
    console.log(
      "APP STARTED ON PORT ",
      port,
      `: http://localhost:${port}${baseUrl}`
    );
  });
}

serve();
