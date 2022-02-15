const {
  findLiveChatroomListByToilet,
  createChatroom,
} = require("../service/chatroom");
const { RESPONSE_RESULT, ERROR_MESSAGES } = require("../utils/constants");
const ErrorWithStatus = require("../utils/ErrorwithStatus");

exports.checkLiveChatroomList = async (req, res, next) => {
  const { toiletId, populate, isNullParticipant } = req.query;
  const userId = req.userInfo._id;

  try {
    const liveChatRoomData = await findLiveChatroomListByToilet(
      toiletId,
      userId,
      isNullParticipant,
      populate
    );

    res.json({
      result: RESPONSE_RESULT.OK,
      liveChatRoomData,
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

exports.createLiveChatroom = async (req, res, next) => {
  const { toiletId } = req.query;
  const userId = req.userInfo._id;

  try {
    const newLiveChatroom = await createChatroom(toiletId, userId);

    res.json({ result: RESPONSE_RESULT.OK, newLiveChatroom });
  } catch (error) {
    next(
      new ErrorWithStatus(
        error,
        500,
        RESPONSE_RESULT.ERROR,
        ERROR_MESSAGES.FAILED_TO_CREATE_CHATROOM
      )
    );
  }
};
