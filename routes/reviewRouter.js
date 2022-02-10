const express = require("express");
const router = express.Router();

const { saveReview, editReview } = require("../controller/reviewController");
const verifyPoodadakToken = require("../middlewares/verifyPoodadakToken");

router.post("/review", verifyPoodadakToken, saveReview);
router.post("/review/:id", verifyPoodadakToken, editReview);

module.exports = router;
