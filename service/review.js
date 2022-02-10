const Review = require("../model/Review");

exports.createReview = async (newReview) => {
  await Review.create(newReview);
};

exports.updateReview = async (id, updatedReview) => {
  await Review.findByIdAndUpdate(id, updatedReview);
};
