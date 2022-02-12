const { getReviews, SOSUpdate } = require("../service/toilets");

exports.getReviewsList = async (req, res, next) => {
  const { id } = req.params;

  try {
    const reviewList = await getReviews(id);

    res.json({ result: "ok", reviewList });

    return;
  } catch (error) {
    next(error);
  }
};

exports.postSOS = async (req, res, next) => {
  const { toilet_id, SOSState } = req.body;

  try {
    const response = await SOSUpdate(toilet_id, SOSState);

    res.json({ result: "ok", response });

    return;
  } catch (error) {
    next(error);
  }
};
