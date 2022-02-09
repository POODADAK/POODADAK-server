const { getReviews } = require("../service/toilets");

exports.getReviewsList = async (req, res, next) => {
  const { id } = req.params;
  try {
    const { reviewList } = await getReviews(id);

    res.json({
      result: "ok",
      reviewList,
    });

    return;
  } catch (error) {
    res.json({
      result: "error",
      errMessage: "ERROR: fail to get reviews...",
    });
  }
};
