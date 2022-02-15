const { getNearToilets, getReviews } = require("../service/toilets");
const { RESPONSE_RESULT, ERROR_MESSAGES } = require("../utils/constants");
const ErrorWithStatus = require("../utils/ErrorwithStatus");

exports.getNearToiletsList = async (req, res, next) => {
  const { lat, lng } = req.query;
  try {
    const toiletList = await getNearToilets(lat, lng);

    res.json({
      result: RESPONSE_RESULT.OK,
      toiletList,
    });

    return;
  } catch (error) {
    next(
      new ErrorWithStatus(
        error,
        400,
        RESPONSE_RESULT.ERROR,
        ERROR_MESSAGES.FAILED_TO_GET_TOILET
      )
    );
  }
};

exports.getReviewsList = async (req, res, next) => {
  const { id } = req.params;

  try {
    const reviewList = await getReviews(id);

    res.json({ result: "ok", reviewList });

    return;
  } catch (error) {
    next(
      new ErrorWithStatus(
        error,
        500,
        RESPONSE_RESULT.ERROR,
        ERROR_MESSAGES.FAILED_TO_GET_REVIEW_LIST
      )
    );
  }
};
