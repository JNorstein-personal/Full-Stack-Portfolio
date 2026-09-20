require("dotenv").config();

const {
  loadEnvironment,
} = require("./config/env");
const {
  createApp,
} = require("./app");

const environment = loadEnvironment();
const app = createApp({
  environment,
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
