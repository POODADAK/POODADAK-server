const express = require("express");
const router = express.Router();

const { auth } = require("../controller/user");

router.post("/naver", auth);

module.exports = router;
