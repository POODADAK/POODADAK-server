const express = require("express");
const router = express.Router();

const {
  checkLiveChatroom,
  getLiveChatroomList,
} = require("../controller/chatroomController");
const verifyPoodadakToken = require("../middlewares/verifyPoodadakToken");

router.get("/live-chatroom", verifyPoodadakToken, checkLiveChatroom);
router.get("/live-chatroom/:userId", getLiveChatroomList);

module.exports = router;
