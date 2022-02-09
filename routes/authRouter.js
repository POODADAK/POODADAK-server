const express = require("express");
const router = express.Router();

const {
  signinKakao,
  signinNaver,
  eraseCookie,
} = require("../controller/authController");

router.get("/token-elimination", eraseCookie);

router.post("/kakao", signinKakao);
router.post("/naver", signinNaver);

module.exports = router;
