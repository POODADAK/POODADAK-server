const express = require("express");
const router = express.Router();

const { checkLiveChatroom } = require("../controller/chatroomController");
const verifyPoodadakToken = require("../middlewares/verifyPoodadakToken");

router.get("/live-chatroom", verifyPoodadakToken, checkLiveChatroom);

module.exports = router;
