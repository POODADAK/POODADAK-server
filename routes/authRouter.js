const express = require("express");

const authController = require("../controller/authController");

const router = express.Router();

router.post("/kakao", authController.signinKakao);

module.exports = router;
