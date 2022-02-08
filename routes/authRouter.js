const express = require("express");
const router = express.Router();

const { signinKakao, signinNaver } = require("../controller/authController");

router.post("/kakao", signinKakao);
router.post("/naver", signinNaver);

module.exports = router;
