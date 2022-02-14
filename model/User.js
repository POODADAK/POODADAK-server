const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    enum: ["GOLD", "SILVER", "BRONZE"],
    default: "BRONZE",
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  socialService: {
    type: String,
    enum: ["KAKAO", "NAVER"],
    required: true,
  },
  reviewList: {
    type: [mongoose.ObjectId],
    ref: "Review",
  },
  currentChatRoom: {
    type: mongoose.ObjectId,
    ref: "Chatroom",
  },
});

module.exports = mongoose.model("User", userSchema);
