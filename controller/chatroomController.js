const { findLiveChatroomListByToilet } = require("../service/chatroom");
const { RESPONSE_RESULT, ERROR_MESSAGES } = require("../utils/constants");
const ErrorWithStatus = require("../utils/ErrorwithStatus");

exports.checkLiveChatroomList = async (req, res, next) => {
  const { toiletId } = req.query;
  const userId = req.userInfo._id;

  try {
    const liveChatRoomList = await findLiveChatroomListByToilet(
      toiletId,
      userId
    );

    res.json({
      result: RESPONSE_RESULT.OK,
      liveChatRoomList,
    });

    return;
  } catch (error) {
    next(
      new ErrorWithStatus(
        error,
        500,
        RESPONSE_RESULT.ERROR,
        ERROR_MESSAGES.FAILED_TO_CHECK_LIVE_CHATROOM
      )
    );
  }
};
