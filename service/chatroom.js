const Chatroom = require("../model/Chatroom");

exports.findLiveChatroomByToilet = async (toiletId, userId) => {
  const liveChatroomList = await Chatroom.find({
    toilet: toiletId,
    isLive: true,
  });
  let isMyChat = false;

  for (const liveChat of liveChatroomList) {
    if (String(liveChat.owner) === String(userId)) {
      isMyChat = true;
    }
  }

  return { liveChatroomList, isMyChat };
};
