const {
  createReview,
  updateReview,
  findReviewById,
  deleteReviewById,
} = require("../service/review");
const {
  updateLatestToiletPaperInfoById,
  addReviewtoToilet,
  deleteReviewByToiletId,
} = require("../service/toilets");
const { addReviewToUser, deleteReviewByUserId } = require("../service/user");
const { RESPONSE_RESULT, ERROR_MESSAGES } = require("../utils/constants");
const ErrorWithStatus = require("../utils/ErrorwithStatus");

exports.getReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const existingReview = await findReviewById(reviewId);

    res.json(existingReview);
    return;
  } catch (error) {
    next(
      new ErrorWithStatus(
        error,
        500,
        RESPONSE_RESULT.ERROR,
        ERROR_MESSAGES.FAILED_TO_FIND_REVIEW
      )
    );
  }
};

exports.saveReview = async (req, res, next) => {
  try {
    const { toilet, rating, description, image, hasToiletPaper, updatedAt } =
      req.body;
    const submittedReview = {
      writer: req.userInfo._id,
      toilet,
      rating,
      description,
      image,
      updatedAt,
    };

    const createdReview = await createReview(submittedReview);
    await updateLatestToiletPaperInfoById(toilet, hasToiletPaper);
    await addReviewtoToilet(toilet, createdReview._id);
    await addReviewToUser(req.userInfo._id, createdReview._id);

    res.json({
      result: RESPONSE_RESULT.OK,
      review: createdReview,
    });

    return;
  } catch (error) {
    next(
      new ErrorWithStatus(
        error,
        500,
        RESPONSE_RESULT.ERROR,
        ERROR_MESSAGES.FAILED_TO_CREATE_REVIEW
      )
    );
  }
};

exports.editReview = async (req, res, next) => {
  const { reviewId } = req.params;

  try {
    const { toilet, rating, description, image, hasToiletPaper, updatedAt } =
      req.body;
    const submittedReview = {
      toilet,
      rating,
      description,
      image,
      hasToiletPaper,
      updatedAt,
    };

    await updateReview(reviewId, submittedReview);
    await updateLatestToiletPaperInfoById(toilet, hasToiletPaper);

    res.json({
      result: RESPONSE_RESULT.OK,
    });

    return;
  } catch (error) {
    next(
      new ErrorWithStatus(
        error,
        500,
        RESPONSE_RESULT.ERROR,
        ERROR_MESSAGES.FAILED_TO_UPDATE_REVIEW
      )
    );
  }
};

exports.deleteReview = async (req, res, next) => {
  const { reviewId } = req.params;

  try {
    const { writer, toilet } = await deleteReviewById(reviewId);
    await deleteReviewByToiletId(toilet, reviewId);
    await deleteReviewByUserId(writer, reviewId);

    res.json({
      result: "ok",
    });
  } catch (error) {
    res.status(400).json({
      result: "error",
      errMessage: "ERROR: failed to delete review...",
    });
  }
};
