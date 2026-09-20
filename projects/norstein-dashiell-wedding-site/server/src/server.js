require("dotenv").config();

const {
  loadEnvironment,
} = require("./config/env");

const environment = loadEnvironment();
const app = require("./app");

app.listen(
  environment.PORT,
  environment.HOST,
  () => {
    console.log(
      `Wedding website API listening on ${environment.HOST}:${environment.PORT}`,
    );
  },
);