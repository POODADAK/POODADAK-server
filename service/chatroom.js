const Chatroom = require("../model/Chatroom");

exports.findLiveChatroomByToilet = async (toiletId, userId) => {
  const liveChatList = await Chatroom.find({ toilet: toiletId, isLive: true });
  let isMyChat = false;

  for (const liveChat of liveChatList) {
    if (String(liveChat.owner) === String(userId)) {
      isMyChat = true;
    }
  }

  return { liveChatList, isMyChat };
};

exports.findLiveChatroomList = async (userId) => {
  const liveChatList = await Chatroom.find({ isLive: true });
  const myChatroomList = [];

  for (const liveChat of liveChatList) {
    if (String(liveChat.owner) === String(userId)) {
      myChatroomList.push(liveChat);
    }
  }

  return myChatroomList;
};
