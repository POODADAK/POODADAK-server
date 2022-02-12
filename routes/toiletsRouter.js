const express = require("express");
const router = express.Router();

const { getReviewsList, postSOS } = require("../controller/toiletsController");

router.get("/review/:id", getReviewsList);
router.post("/emitSOS", postSOS);

module.exports = router;
