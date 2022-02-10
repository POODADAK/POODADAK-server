const { createReview, updateReview } = require("../service/review");

exports.saveReview = async (req, res, next) => {
  try {
    const {
      writer,
      toilet,
      rating,
      description,
      image,
      didToiletPaperExist,
      updatedAt,
    } = req.data;
    const submittedReview = {
      writer,
      toilet,
      rating,
      description,
      image,
      didToiletPaperExist,
      updatedAt,
    };

    const createdReview = await createReview(submittedReview);

    res.json({
      result: "ok",
      review: createdReview,
    });
  } catch {
    res.json({
      result: "error",
      errMessage: "ERROR: failed to create review...",
    });
  }
};

exports.editReview = async (req, res, next) => {
  try {
    const {
      writer,
      toilet,
      rating,
      description,
      image,
      didToiletPaperExist,
      updatedAt,
      reviewId,
    } = req.data;
    const submittedReview = {
      writer,
      toilet,
      rating,
      description,
      image,
      didToiletPaperExist,
      updatedAt,
    };

    const updatedReview = await updateReview(reviewId, submittedReview);

    res.json({
      result: "ok",
      review: updatedReview,
    });
  } catch {
    res.json({
      result: "error",
      errMessage: "ERROR: failed to update review...",
    });
  }
};
