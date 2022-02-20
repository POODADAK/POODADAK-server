const express = require("express");
const router = express.Router();

const {
  checkLiveChatroomList,
  createLiveChatroom,
  getChatroom,
  checkUsersLiveChatroom,
} = require("../controller/chatroomController");
const verifyPoodadakToken = require("../middlewares/verifyPoodadakToken");

router.get("/live-chatroom", verifyPoodadakToken, checkUsersLiveChatroom);
router.get("/live-chatroom-list", verifyPoodadakToken, checkLiveChatroomList);
router.get(
  "/populated-live-chatroom-list",
  verifyPoodadakToken,
  checkLiveChatroomList
);
router.get("/:chatroomId", verifyPoodadakToken, getChatroom);

router.post("/new-chatroom", verifyPoodadakToken, createLiveChatroom);

module.exports = router;
