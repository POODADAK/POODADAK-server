const express = require("express");
const router = express.Router();

const { saveReview, editReview } = require("../controller/reviewController");
const verifyPoodadakToken = require("../middlewares/verifyPoodadakToken");

router.post("/", verifyPoodadakToken, saveReview);
router.post("/:id", verifyPoodadakToken, editReview);

module.exports = router;
