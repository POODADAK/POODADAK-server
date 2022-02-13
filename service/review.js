const Review = require("../model/Review");
const Toilet = require("../model/Toilet");

exports.findReviewById = async (reviewId) => {
  const review = await Review.findById(
    reviewId,
    "rating description image toilet"
  ).lean();

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

exports.updateReview = async (id, updatedReview) => {
  return await Review.findByIdAndUpdate(id, updatedReview);
};
