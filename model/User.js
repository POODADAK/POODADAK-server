/* eslint-disable no-prototype-builtins */
const mongoose = require("mongoose");

const { USER_LEVEL } = require("../utils/constants");

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

userSchema.pre("findOneAndUpdate", async function (next) {
  const { reviewList } = await this.model.findById(this._conditions._id);

  if (this._update.hasOwnProperty("$push")) {
    if (reviewList.length < 4) {
      this._update.$set = { level: USER_LEVEL.BRONZE };
      next();
      return;
    }
    if (reviewList.length < 9) {
      this._update.$set = { level: USER_LEVEL.SILVER };
      next();
      return;
    }
    this._update.$set = { level: USER_LEVEL.GOLD };
    next();
    return;
  }

  if (this._update.hasOwnProperty("$pull")) {
    if (reviewList.length <= 5) {
      this._update.$set = { level: USER_LEVEL.BRONZE };
      next();
      return;
    }
    if (reviewList.length <= 10) {
      this._update.$set = { level: USER_LEVEL.SILVER };
      next();
      return;
    }
    this._update.$set = { level: USER_LEVEL.GOLD };
    next();
    return;
  }
});

module.exports = mongoose.model("User", userSchema);
