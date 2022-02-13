const { findLiveChatroomByToilet } = require("../service/chatroom");

exports.checkLiveChatroom = async (req, res, next) => {
  const { toiletId } = req.query;
  const userId = req.userInfo._id;

  try {
    const liveChatRoomInfo = await findLiveChatroomByToilet(toiletId, userId);

    res.json({
      result: "ok",
      liveChatRoomInfo,
    });
  } catch (error) {
    res.status(400).json({
      result: "error",
      errMessage: "ERROR: fail to check Live chatroom from DB...",
    });
  }
};
