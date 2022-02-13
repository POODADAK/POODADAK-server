const ChatRoom = require("../model/Chatroom");

exports.findLiveChatroomByToilet = async (toiletId, userId) => {
  const liveChatList = await ChatRoom.find({ toilet: toiletId, isLive: true });
  let isMyChat = false;

  for (const liveChat of liveChatList) {
    if (String(liveChat.owner) === String(userId)) {
      isMyChat = true;
    }
  }

  return { liveChatList, isMyChat };
};
