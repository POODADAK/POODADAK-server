const { getNearToilets, getToilet, getReviews } = require("../service/toilets");

exports.getNearToiletsList = async (req, res, next) => {
  const { lat, lng } = req.query;
  try {
    const toiletList = await getNearToilets(lat, lng);

    res.json({
      result: "ok",
      toiletList,
    });

    return;
  } catch (error) {
    res.status(400).json({
      result: "error",
      errMessage: "ERROR: fail to get toilets...",
    });
  }
};

exports.getToliet = async (req, res, next) => {
  const { toiletId } = req.params;

  try {
    const toilet = await getToilet(toiletId);

    res.json({ result: "ok", toilet });

    return;
  } catch (error) {
    res.status(400).json({
      result: "error",
      errMessage: "ERROR: fail to get the toilet...",
    });
  }
};

exports.getReviewsList = async (req, res, next) => {
  const { id } = req.params;

  try {
    const reviewList = await getReviews(id);

    res.json({ result: "ok", reviewList });

    return;
  } catch (error) {
    res.status(400).json({
      result: "error",
      errMessage: "ERROR: fail to get reviewList...",
    });
  }
};
