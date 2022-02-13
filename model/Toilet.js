const mongoose = require("mongoose");

const toiletSchema = new mongoose.Schema({
  toiletType: String,
  toiletName: {
    type: String,
    required: true,
  },
  roadNameAddress: String,
  indexNameAddress: String,
  isUnisexToilet: Boolean,
  menToiletBowlNumber: Number,
  menUrinalNumber: Number,
  menHandicapToiletBowlNumber: Number,
  menHandicapUrinalNumber: Number,
  menChildrenToiletBowlNumber: Number,
  menChildrenUrinalNumber: Number,
  ladiesToiletBowlNumber: Number,
  ladiesHandicapToiletBowlNumber: Number,
  ladiesChildrenToiletBowlNumber: Number,
  institutionName: String,
  phoneNumber: String,
  openTime: String,
  installationYear: Number,
  referenceDate: Date,
  institutionCode: Number,
  latestToiletPaperInfo: {
    lastDate: { type: String },
    isToiletPaper: { type: Boolean },
  },
  location: {
    type: {
      type: String,
      default: "Point",
      required: true,
    },
    coordinates: {
      type: [Number],
      maxlength: 2,
      required: true,
    },
  },
  // isSOS: {
  //   type: Boolean,
  //   default: false,
  // },
  reviewList: {
    type: [mongoose.ObjectId],
    ref: "Review",
  },
  chatRoomList: {
    type: [mongoose.ObjectId],
    ref: "ChatRoom",
    default: [],
  },
});

toiletSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Toilet", toiletSchema);
