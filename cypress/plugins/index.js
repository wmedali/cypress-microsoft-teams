/// <reference types="cypress" />

const {
  beforeRunHook,
  afterRunHook,
} = require("cypress-mochawesome-reporter/lib");

/**
 * @type {Cypress.PluginConfig}
 */

// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  on("before:run", async (details) => {
    console.log("override before:run");
    await beforeRunHook(details);
  });

  on("after:run", async () => {
    console.log("override after:run");
    await afterRunHook();
  });
};
