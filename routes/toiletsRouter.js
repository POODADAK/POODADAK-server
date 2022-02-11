const express = require("express");
const router = express.Router();

const {
  getNearToiletsList,
  getReviewsList,
} = require("../controller/toiletsController");

router.get("/", getNearToiletsList);
router.get("/review/:id", getReviewsList);

module.exports = router;
