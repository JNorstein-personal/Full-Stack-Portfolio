require("dotenv").config();

const app = require("./app");

const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || 3001;

app.listen(PORT, HOST, () => {
  console.log(`Wedding website API listening on ${HOST}:${PORT}`);
});
