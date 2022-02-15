const Chatroom = require("../model/Chatroom");

exports.findLiveChatroomListByToilet = async (toiletId, userId) => {
  const liveChatroomList = await Chatroom.find({
    toilet: toiletId,
    isLive: true,
  });

  let myChatroom = null;

  for (let i = 0; i < liveChatroomList.length; i++) {
    if (
      String(liveChatroomList[i].owner) === String(userId) ||
      String(liveChatroomList[i].participant) === String(userId)
    ) {
      myChatroom = liveChatroomList[i];
    }
  }
  //내 채팅룸 찾기

  return { liveChatroomList, myChatroom };
};
