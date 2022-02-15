/* eslint-disable no-prototype-builtins */
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

userSchema.post("findOneAndUpdate", async function (doc, next) {
  if (doc.reviewList.length < 5) {
    doc.level = "BRONZE";
    await doc.save();
    next();
    return;
  }

  if (doc.reviewList.length < 10) {
    doc.level = "SILVER";
    await doc.save();
    next();
    return;
  }

  if (doc.reviewList.length >= 10) {
    doc.level = "GOLD";
    await doc.save();
    next();
    return;
  }
});

module.exports = mongoose.model("User", userSchema);
