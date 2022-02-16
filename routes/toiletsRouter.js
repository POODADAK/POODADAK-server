const express = require("express");
const router = express.Router();

const {
  getNearToiletsList,
  getReviewsList,
  getToilet,
} = require("../controller/toiletsController");

router.get("/", getNearToiletsList);
router.get("/:toiletId", getToilet);
router.get("/review/:toiletId", getReviewsList);

module.exports = router;
