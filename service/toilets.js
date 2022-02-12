// populate할때 사용됨.
// eslint-disable-next-line no-unused-vars
const Review = require("../model/Review");
const Toilet = require("../model/Toilet");
// eslint-disable-next-line no-unused-vars
const User = require("../model/User");

exports.getReviews = async function (id) {
  const { reviewList } = await Toilet.findById(id).populate("reviewList");

  for (const review of reviewList) {
    await review.populate("writer");
  }

  return reviewList;
};

exports.SOSUpdate = async function (id, option) {
  return await Toilet.findByIdAndUpdate(id, { isSOS: option });
};

exports.updateLatestToiletPaperInfoById = async function (id, hasToiletPaper) {
  return await Toilet.findByIdAndUpdate(id, {
    $set: {
      latestToiletPaperInfo: {
        lastDate: new Date().toISOString(),
        hasToiletPaper,
      },
    },
  });
};

exports.addReviewtoToilet = async function (toiletId, reviewId) {
  return await Toilet.findByIdAndUpdate(toiletId, {
    $addToSet: { reviewList: reviewId },
  });
};
