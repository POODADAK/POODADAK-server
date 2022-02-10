require("dotenv").config();
require("./config/mongoose");

const path = require("path");

const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const logger = require("morgan");

const authRouter = require("./routes/authRouter");
const reviewRouter = require("./routes/reviewRouter");
const toiletsRouter = require("./routes/toiletsRouter");

const corsOptions = {
  origin: process.env.CORS_ORIGIN_URL,
  preflightContinue: true,
  credentials: true,
};

const app = express();

app.use(cors(corsOptions));
app.use(helmet());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors(corsOptions));

app.use("/auth", authRouter);
app.use("/toilets", toiletsRouter);
app.use("/review", reviewRouter);

module.exports = app;
