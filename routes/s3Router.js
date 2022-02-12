const express = require("express");
const router = express.Router();

const { getS3Url } = require("../controller/s3Controller");
const verifyPoodadakToken = require("../middlewares/verifyPoodadakToken");

router.get("/", verifyPoodadakToken, getS3Url);

module.exports = router;
