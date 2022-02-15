const express = require("express");
const router = express.Router();

const { checkLiveChatroomList } = require("../controller/chatroomController");
const verifyPoodadakToken = require("../middlewares/verifyPoodadakToken");

router.get("/live-chatroom-list", verifyPoodadakToken, checkLiveChatroomList);

module.exports = router;
