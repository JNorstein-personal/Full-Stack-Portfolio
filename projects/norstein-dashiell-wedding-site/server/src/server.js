require("dotenv").config();

const {
  loadEnvironment,
} = require("./config/env");
const {
  createApp,
} = require("./app");
const {
  createConfiguredEmailTransport,
} = require("./services/resendEmailTransport");

const environment = loadEnvironment();
const emailTransport =
  createConfiguredEmailTransport({
    environment,
  });
const app = createApp({
  environment,
  emailTransport,
});

app.listen(
  environment.PORT,
  environment.HOST,
  () => {
    console.log(
      `Wedding website API listening on ${environment.HOST}:${environment.PORT}`,
    );
  },
);
