const express = require("express");
const router = express.Router();

const {
  signinKakao,
  signinNaver,
  eraseCookie,
  verifyPoodadakToken,
} = require("../controller/authController");

router.post("/kakao", signinKakao);
router.post("/naver", signinNaver);
router.post("/token-elimination", eraseCookie);
router.post("/token-verification", verifyPoodadakToken);

module.exports = router;
