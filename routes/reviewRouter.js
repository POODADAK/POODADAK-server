const express = require("express");
const router = express.Router();

const { saveReview, editReview } = require("../controller/reviewController");

router.post("/review", saveReview);
router.post("/review/:id", editReview);

module.exports = router;
