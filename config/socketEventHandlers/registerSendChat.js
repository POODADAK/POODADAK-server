const Chatroom = require("../../model/Chatroom");
const ERROR_MESSAGES = require("../../utils/constants");
const ErrorWithStatus = require("../../utils/ErrorwithStatus");

function registerSendChat(socket, chatroomId) {
  const roomName = socket.handshake.query.room;

  socket.on("sendChat", async (chat) => {
    const isChatEmpty = !chat.message.trim().length;

    if (isChatEmpty) {
      return;
    }

    try {
      await Chatroom.findByIdAndUpdate(chatroomId, {
        $push: { chatList: chat },
      });

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
