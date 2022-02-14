const { findReviewByUserId } = require("../service/profile");

exports.getUserProfile = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const response = await findReviewByUserId(userId);

    res.json(response);

    return;
  } catch (error) {
    res.json({
      result: "error",
      errMessage: "ERROR: fail to get userProfile...",
    });
  }
};
