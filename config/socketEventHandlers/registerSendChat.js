const Chatroom = require("../../model/Chatroom");
const { THIRTY_MINUTES } =
  require("../../utils/constants").MINUTE_TO_MILLISECONDS;
const ERROR_MESSAGES = require("../../utils/constants");
const ErrorWithStatus = require("../../utils/ErrorwithStatus");

function registerSendChat(socket, chatroomId) {
  const roomName = socket.handshake.query.room;

  let timerId = setTimeout(async () => {
    socket.disconnect(true);
  }, THIRTY_MINUTES);

  socket.on("sendChat", async (chat) => {
    const isChatEmpty = !chat.message.trim().length;

    if (isChatEmpty) {
      return;
    }

    clearTimeout(timerId);

    timerId = setTimeout(async () => {
      socket.emit("chatTimeout");
      socket.disconnect(true);
    }, THIRTY_MINUTES);

    try {
      const existingChatroom = await Chatroom.findByIdAndUpdate(chatroomId, {
        $push: { chatList: chat },
      });

      chat.updatedChatListLength = existingChatroom.chatList.length + 1;

      socket.broadcast.to(roomName).emit("receiveChat", chat);
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
  });
}

module.exports = registerSendChat;
