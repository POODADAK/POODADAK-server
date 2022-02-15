const express = require("express");
const router = express.Router();

const {
  checkLiveChatroomList,
  createLiveChatroom,
} = require("../controller/chatroomController");
const verifyPoodadakToken = require("../middlewares/verifyPoodadakToken");

router.get("/live-chatroom-list", verifyPoodadakToken, checkLiveChatroomList);
router.get(
  "/populated-live-chatroom-list",
  verifyPoodadakToken,
  checkLiveChatroomList
);

router.post("/new-chatroom", verifyPoodadakToken, createLiveChatroom);

module.exports = router;
