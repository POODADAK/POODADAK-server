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

userSchema.pre("findOneAndUpdate", async function (next) {
  const { reviewList } = await this.model.findById(this._conditions._id);

  if (reviewList.length >= 10) {
    this._update.$set = { level: "GOLD" };
    next();
  }
  if (reviewList.length < 10 && reviewList.length >= 5) {
    this._update.$set = { level: "SILVER" };
    next();
  }
});

module.exports = mongoose.model("User", userSchema);
