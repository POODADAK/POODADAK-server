// populate할때 사용됨.
// eslint-disable-next-line no-unused-vars
const Review = require("../model/Review");
const Toilet = require("../model/Toilet");

exports.getReviews = async function (id) {
  return await Toilet.findById(id).populate("reviewList");
};
