const Review = require("../model/Review");
const Toilet = require("../model/Toilet");

exports.findReviewById = async (reviewId) => {
  const review = await Review.findById(reviewId).lean();

  const { latestToiletPaperInfo } = await Toilet.findById(
    review.toilet,
    "latestToiletPaperInfo"
  ).lean();

  return {
    hasToiletPaper: latestToiletPaperInfo?.hasToiletPaper ? true : false,
    ...review,
  };
};

exports.createReview = async (newReview) => {
  return await Review.create(newReview);
};

exports.updateReview = async (reviewId, updatedReview) => {
  return await Review.findByIdAndUpdate(reviewId, updatedReview);
};

exports.deleteReviewById = async (reviewId) => {
  return await Review.findByIdAndRemove(reviewId);
};
