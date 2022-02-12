const express = require("express");
const router = express.Router();

const {
  getNearToiletsList,
  getReviewsList,
  postSOS,
} = require("../controller/toiletsController");

router.get("/", getNearToiletsList);
router.get("/review/:id", getReviewsList);
router.post("/emitSOS", postSOS);

module.exports = router;
