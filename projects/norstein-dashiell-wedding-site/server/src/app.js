const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();

app.use(helmet());
app.use(express.json());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

app.use("/wedding/api", apiLimiter);

app.get("/wedding/api/health", (req, res) => {
  res.json({
    status: "ok",
    application: "Norstein-Dashiell Wedding Website",
  });
});

module.exports = app;