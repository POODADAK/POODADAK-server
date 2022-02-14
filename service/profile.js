const User = require("../model/User");

exports.findReviewByUserId = async (userId) => {
  return await User.findById(userId)
    .populate({
      path: "reviewList",
      populate: { path: "toilet", model: "Toilet" },
    })
    .lean();
};
