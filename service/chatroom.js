const Chatroom = require("../model/Chatroom");
const Toilet = require("../model/Toilet");

exports.findLiveChatroomListByToilet = async (
  toiletId,
  userId,
  isNullParticipant,
  populate
) => {
  let liveChatroomList;

  if (isNullParticipant) {
    liveChatroomList = await Chatroom.find({
      toilet: toiletId,
      isLive: true,
      participant: null,
    }).populate(populate);
  } else {
    liveChatroomList = await Chatroom.find({
      toilet: toiletId,
      isLive: true,
    }).populate(populate);
  }

  let myChatroom = null;

  for (let i = 0; i < liveChatroomList.length; i++) {
    if (
      String(liveChatroomList[i].owner) === String(userId) ||
      String(liveChatroomList[i].participant) === String(userId)
    ) {
      myChatroom = liveChatroomList[i];
      break;
    }
  }

  return { liveChatroomList, myChatroom };
};

exports.createChatroom = async (toiletId, userId) => {
  await Toilet.findByIdAndUpdate(toiletId, { isSOS: true });

  return await Chatroom.create({
    owner: userId,
    toilet: toiletId,
  });
};

exports.getChatroomById = async (chatroomId) => {
  return await Chatroom.findById(chatroomId);
};
