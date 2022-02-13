// populate할때 사용됨.
// eslint-disable-next-line no-unused-vars
const Review = require("../model/Review");
const Toilet = require("../model/Toilet");
// eslint-disable-next-line no-unused-vars
const User = require("../model/User");

exports.getNearToilets = async function (lat, lng) {
  return await Toilet.find({
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [lng, lat],
        },
        $maxDistance: 500,
        $minDistance: 0,
      },
    },
  });
};

exports.getReviews = async function (id) {
  const { reviewList } = await Toilet.findById(id)
    .populate({
      path: "reviewList",
      populate: { path: "toilet", model: "Toilet" },
    })
    .populate({
      path: "reviewList",
      populate: { path: "writer", model: "User" },
    })
    .lean();

  return reviewList;
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

exports.checkSOS;
