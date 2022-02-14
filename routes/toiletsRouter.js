const express = require("express");
const router = express.Router();

const {
  getNearToiletsList,
  getToliet,
  getReviewsList,
} = require("../controller/toiletsController");

router.get("/", getNearToiletsList);
router.get("/toilet/:toiletId", getToliet);
router.get("/review/:id", getReviewsList);

module.exports = router;
