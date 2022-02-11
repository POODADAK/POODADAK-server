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
  const { reviewList } = await Toilet.findById(id).populate("reviewList");

  for (const review of reviewList) {
    await review.populate("writer");
  }

  return reviewList;
};
