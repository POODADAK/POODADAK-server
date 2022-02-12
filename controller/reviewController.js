const {
  createReview,
  updateReview,
  findReviewById,
} = require("../service/review");
const {
  updateLatestToiletPaperInfoById,
  addReviewtoToilet,
} = require("../service/toilets");

exports.getReview = async (req, res, next) => {
  try {
    const reviewId = req.params.id;
    const existingReview = await findReviewById(reviewId);

    res.json(existingReview);
  } catch (error) {
    next(error);
  }
};

exports.saveReview = async (req, res, next) => {
  try {
    const { toilet, rating, description, image, isToiletPaper, updatedAt } =
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
    await updateLatestToiletPaperInfoById(toilet, isToiletPaper);
    await addReviewtoToilet(toilet, createdReview._id);

    res.json({
      result: "ok",
      review: createdReview,
    });
  } catch (error) {
    res.status(400).json({
      result: "error",
      errMessage: "ERROR: failed to create review...",
    });
  }
};

exports.editReview = async (req, res, next) => {
  const reviewId = req.params.id;

  try {
    const { toilet, rating, description, image, isToiletPaper, updatedAt } =
      req.body;
    const submittedReview = {
      toilet,
      rating,
      description,
      image,
      isToiletPaper,
      updatedAt,
    };

    await updateReview(reviewId, submittedReview);
    await updateLatestToiletPaperInfoById(toilet, isToiletPaper);

    res.json({
      result: "ok",
    });
  } catch (error) {
    res.status(400).json({
      result: "error",
      errMessage: "ERROR: failed to update review...",
    });
  }
};
