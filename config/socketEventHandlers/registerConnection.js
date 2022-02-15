const Chatroom = require("../../model/Chatroom");
const Toilet = require("../../model/Toilet");
const { ERROR_MESSAGES } = require("../../utils/constants");
const ErrorWithStatus = require("../../utils/ErrorwithStatus");

async function registerConnection(socket) {
  const roomDBId = socket.handshake.query.roomDBId;
  const userId = socket.userId;
  const toiletId = socket.nsp.name.split("-")[1];
  const roomName = socket.handshake.query.room;
  let chatroomDocument;

  socket.join(roomName);

  // eslint-disable-next-line no-console
  console.log(
    `User ${socket.id} ❗️connected to namespace 🚽toiletId-${toiletId} and joined 🚪room ${roomName}`
  );

  try {
    if (roomDBId !== "") {
      chatroomDocument = await Chatroom.findById(roomDBId).lean();
    } else {
      chatroomDocument = await Chatroom.create({
        owner: userId,
        toilet: toiletId,
        isLive: true,
      });
    }

    if (!chatroomDocument) {
      throw new Error(ERROR_MESSAGES.FAILED_TO_FIND_EXISTING_CHATROOM);
    }

    await Toilet.findByIdAndUpdate(toiletId, { isSOS: true });
    socket.emit("joinChatroom", chatroomDocument);

    return chatroomDocument._id;
  } catch (error) {
    socket.emit(
      "db-error",
      new ErrorWithStatus(
        error,
        500,
        ERROR_MESSAGES.FAILED_TO_COMMUNICATE_WITH_DB
      ).toPlainSocketErrorObject()
    );
    socket.disconnect(true);
  }
}

module.exports = registerConnection;
