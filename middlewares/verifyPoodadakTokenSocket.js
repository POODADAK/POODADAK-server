const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const { getUserById } = require("../service/user");
const { RESPONSE_RESULT, ERROR_MESSAGES } = require("../utils/constants");
const ErrorWithStatus = require("../utils/ErrorwithStatus");

const verifyPoodadakTokenSocket = async (socket, next) => {
  try {
    const fetchedToken = socket.handshake?.auth?.token;

    if (!fetchedToken) {
      throw new Error("no token in header!");
    }

    const { id } = await jwt.verify(fetchedToken, process.env.JWT_SECRET);
    const user = await getUserById(id);

    if (!user) {
      throw new Error("no user!");
    }

    socket.userId = id;

    next();
  } catch (error) {
    const isMongooseError = error instanceof mongoose.Error;
    let errMessage = ERROR_MESSAGES.FAILED_TO_VERIFY_TOKEN;
    let statusCode = 401;

    if (isMongooseError) {
      errMessage = ERROR_MESSAGES.FAILED_TO_COMMUNICATE_WITH_DB;
      statusCode = 500;
    }

    next(
      new ErrorWithStatus(error, statusCode, RESPONSE_RESULT.ERROR, errMessage)
    );
  }
};

module.exports = verifyPoodadakTokenSocket;
