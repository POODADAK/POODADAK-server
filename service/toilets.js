// populate할때 사용됨.
const ChatRoom = require("../model/Chatroom");
// eslint-disable-next-line no-unused-vars
const Review = require("../model/Review");
const Toilet = require("../model/Toilet");
// eslint-disable-next-line no-unused-vars
const User = require("../model/User");

exports.getNearToilets = async function (lat, lng) {
  return await Toilet.find({
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [lng, lat],
        },
        $maxDistance: 500,
        $minDistance: 0,
      },
    },
  });
};

exports.getReviews = async function (id) {
  const { reviewList } = await Toilet.findById(id).populate("reviewList");

  for (const review of reviewList) {
    await review.populate("writer");
  }

  return reviewList;
};

exports.updateLatestToiletPaperInfoById = async function (id, hasToiletPaper) {
  return await Toilet.findByIdAndUpdate(id, {
    $set: {
      latestToiletPaperInfo: {
        lastDate: new Date().toISOString(),
        hasToiletPaper,
      },
    },
  });
};

exports.addReviewtoToilet = async function (toiletId, reviewId) {
  return await Toilet.findByIdAndUpdate(toiletId, {
    $addToSet: { reviewList: reviewId },
  });
};

exports.updateSOS = async function (toiletId) {
  const liveChatList = await ChatRoom.find({ toilet: toiletId, isLive: true });
  // console.log("why", liveChatList, !!liveChatList.length);
  const isLiveChat = !!liveChatList.length;

  if (!isLiveChat) {
    await Toilet.findByIdAndUpdate(toiletId, { isSOS: false });
    return;
  }
};
