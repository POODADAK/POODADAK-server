const express = require("express");
const router = express.Router();

const {
  signinKakao,
  signinNaver,
  eraseCookie,
} = require("../controller/authController");

router.post("/kakao", signinKakao);
router.post("/naver", signinNaver);
router.post("/token-elimination", eraseCookie);

module.exports = router;
