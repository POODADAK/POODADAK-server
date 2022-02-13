require("dotenv").config();
require("./config/mongoose");

const path = require("path");

const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const logger = require("morgan");

const authRouter = require("./routes/authRouter");
const chatroomRouter = require("./routes/chatroomRouter");
const reviewRouter = require("./routes/reviewRouter");
const s3Router = require("./routes/s3Router");
const toiletsRouter = require("./routes/toiletsRouter");

const corsOptions = {
  origin: process.env.CORS_ORIGIN_URL,
  credentials: true,
};

const app = express();

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
app.use("/chatroom", chatroomRouter);
app.use("/s3Url", s3Router);

module.exports = app;
