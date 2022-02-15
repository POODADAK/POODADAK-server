const { findLiveChatroomByToilet } = require("../service/chatroom");
const { RESPONSE_RESULT, ERROR_MESSAGES } = require("../utils/constants");
const ErrorWithStatus = require("../utils/ErrorwithStatus");

exports.checkLiveChatroom = async (req, res, next) => {
  const { toiletId } = req.query;
  const userId = req.userInfo._id;

  try {
    const liveChatRoomInfo = await findLiveChatroomByToilet(toiletId, userId);

    res.json({
      result: RESPONSE_RESULT.OK,
      liveChatRoomInfo,
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
