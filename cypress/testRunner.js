const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const argv = yargs(hideBin(process.argv)).argv;

const cypress = require("cypress");
const axios = require("axios");
const prettyMs = require("pretty-ms");

let jobExitCode = 0;
const WEBHOOK_URL =
  "https://ingeniuslab018.webhook.office.com/webhookb2/b0b6c26d-d13d-4323-9dba-5df2de09c3fa@4179941a-152a-424a-a88d-0ffdddce19e2/IncomingWebhook/a365986cc21b452e996240aea0693734/cec0a88a-457b-409f-a9a5-497e80a8d7c7";

let GITHUB_REPO =
  "https://github.com/wmedali/cypress-microsoft-teams/actions/runs";

class TestRunContext {
  constructor(results) {
    this.duration = results.totalDuration;
    this.totalTests = results.totalTests;
    this.totalFailed = results.totalFailed;
    this.totalPassed = results.totalPassed;
    this.totalSkipped = results.totalSkipped;
    this.runFailures = results.failures;
    this.start = new Date(results.startedTestsAt);
    this.end = new Date(results.endedTestsAt);
    this.payload = "";
    // this.failedTests = results.runs.map() Parse failed tests
  }

  get percentagePassed() {
    return (
      (this.totalFailed * 100) /
      (this.totalPassed + this.totalFailed)
    ).toFixed(2);
  }

  get contextMessage() {
    return `**E2E** Tests Execution Summary `;
  }

  get runDuration() {
    return prettyMs(this.end - this.start);
  }

  get colour() {
    return this.totalFailed > 0 ? "FF6600" : "00CC00";
  }

  get notificationPayload() {
    const payload = require("./fixtures/notification.json");
    this.payload = this.runFailures > 0 ? payload.failure : payload.success;

    if (!this.runFailures) {
      const status = this.totalFailed > 0 ? "Failed" : "Passed";
      if (status === "Failed") jobExitCode = 1;
      // Tests context
      this.payload.themeColor = this.colour;
      this.payload.sections[0].activityImage =
        "https://i.imgur.com/cqos1R6.jpg";
      this.payload.sections[0].activityTitle = `Run Id : ${argv.id}`;
      this.payload.sections[0].activitySubtitle += `**${this.runDuration}**`;

      // Tests Summary
      this.payload.sections[0].facts[0].value = this.totalTests;
      this.payload.sections[0].facts[1].value = argv.branch;
      this.payload.sections[0].facts[2].value = argv.commit;

      // View Test Reports Button
      this.payload.potentialAction[0].targets[0].uri = `${GITHUB_REPO}/${argv.id}`;

      // Summary text
      this.payload.sections[0].text = `Status :**${status}** - **${this.totalFailed}** Failed - **${this.totalPassed}** Passed`;
    }

    return this.payload;
  }
}

const sendMessage = (payload) => {
  return new Promise((resolve, reject) => {
    axios
      .post(WEBHOOK_URL, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        // if tests ok resolve, otherwise reject
        resolve(response.status);
      })
      .catch((error) => {
        jobExitCode = 2;
        let errorMessage = `ERROR ${error}`;
        if (error.response) {
          errorMessage += error.response.data;
        }
        reject(errorMessage);
      });
  });
};

cypress
  .run()
  .then((results) => {
    return new TestRunContext(results);
  })
  .then((resultsContext) => {
    const payload = resultsContext.notificationPayload;
    return sendMessage(payload);
  })
  .then((status) => {
    console.log("Microsoft Teams POST request response code :" + status);
    process.exit(jobExitCode);
  })
  .catch((error) => {
    console.error(error);
    jobExitCode = 3;
    process.exit(jobExitCode);
  });
