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
  // console.log("=====reviewList", reviewList);

  if (reviewList.length > 9) {
    this._update.$set = { level: "GOLD" };
    next();
  }
  if (reviewList.length <= 9 && reviewList.length >= 4) {
    this._update.$set = { level: "SILVER" };
    next();
  }
  if (reviewList.length < 4) {
    this._update.$set = { level: "BRONZE" };
    next();
  }
});

// userSchema.pre("findOneAndDelete", async function (next) {
//   console.log("=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-", this);
//   const { reviewList } = await this.model.findById(this._conditions.reviewList);
//   console.log("=-=-=-=-=-=-=-=-=-==========", reviewList.length);
//   console.log("=-=-=-=-=-=-=-=-=-==========", reviewList);
//   console.log("-------", this._update);
//   if (reviewList.length < 10 && reviewList.length >= 5) {
//     this._update.$set = { level: "SILVER" };
//     console.log("-------", this._update);
//     next();
//   }
//   if (reviewList.length < 5) {
//     this._update.$set = { level: "BRONZE" };
//     console.log("-------", this._update);
//     next();
//   }
// });

// userSchema.post("findOneAndDelete");

module.exports = mongoose.model("User", userSchema);
