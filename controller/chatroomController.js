const { findLiveChatroomListByToilet } = require("../service/chatroom");

exports.checkLiveChatroomList = async (req, res, next) => {
  const { toiletId } = req.query;
  const userId = req.userInfo._id;

  try {
    const liveChatRoomList = await findLiveChatroomListByToilet(
      toiletId,
      userId
    );

    res.json({
      result: "ok",
      liveChatRoomList,
    });
  } catch (error) {
    res.status(400).json({
      result: "error",
      errMessage: "ERROR: fail to check Live chatroom from DB...",
    });
  }
};
