const Chatroom = require("../../model/Chatroom");
const ERROR_MESSAGES = require("../../utils/constants");
const ErrorWithStatus = require("../../utils/ErrorwithStatus");

function registerLoadChatList(socket) {
  socket.on("loadChatList", async (chatroomId) => {
    try {
      const { chatList } = await Chatroom.findById(chatroomId, "chatList");
      socket.emit("findExistingChatList", chatList);
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

module.exports = registerLoadChatList;
