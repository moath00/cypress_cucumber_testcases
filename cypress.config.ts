import { defineConfig } from "cypress";

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://opensource-demo.orangehrmlive.com/web/index.php/",

    async setupNodeEvents(on, config) {
      // implement node event listeners here
      return require("./cypress/plugins")(on, config);
    },
    env: {
      allure: true,
      allureReuseAfterSpec: true,
      download_dir: "./cypress/downloads",
      snapshotOnly: true,
      allureResultsPath: "allure-results",
      allureAttachRequests: true,
    },
    specPattern: "cypress/e2e/*.feature",
    videosFolder: "allure-results/",
    screenshotOnRunFailure: true,
  },
});
