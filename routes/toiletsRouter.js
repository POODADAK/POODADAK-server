const express = require("express");
const router = express.Router();

const { getReviewsList } = require("../controller/toiletsController");

router.get("/review/:id", getReviewsList);

module.exports = router;
