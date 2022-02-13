const express = require("express");
const router = express.Router();

const {
  saveReview,
  editReview,
  getReview,
} = require("../controller/reviewController");
const verifyPoodadakToken = require("../middlewares/verifyPoodadakToken");

router.get("/:reviewId", getReview);

router.post("/", verifyPoodadakToken, saveReview);
router.post("/:reviewId", verifyPoodadakToken, editReview);

module.exports = router;
