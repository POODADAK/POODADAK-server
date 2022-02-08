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
  },
  email: {
    type: String,
    required: true,
  },
  socialService: {
    type: String,
    enum: ["KAKAO", "NAVER"],
  },
  reviews: {
    type: [mongoose.ObjectId],
    ref: "Reviews",
  },
  currentChatRoom: {
    type: mongoose.ObjectId,
    ref: "Chatroom",
  },
});

module.exports = mongoose.model("User", userSchema);
