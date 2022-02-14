const generateS3UploadURL = require("../config/s3");
const { RESPONSE_RESULT, ERROR_MESSAGES } = require("../utils/constants");
const ErrorWithStatus = require("../utils/ErrorwithStatus");

exports.getS3Url = async (req, res, next) => {
  try {
    const url = await generateS3UploadURL();
    res.json({ result: RESPONSE_RESULT.OK, s3Url: url });

    return;
  } catch (error) {
    next(
      new ErrorWithStatus(
        error,
        500,
        RESPONSE_RESULT.ERROR,
        ERROR_MESSAGES.FAILED_TO_GET_S3_URL
      )
    );
  }
};
