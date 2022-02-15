const Chatroom = require("../../model/Chatroom");
const { updateSOS } = require("../../service/toilets");
const ERROR_MESSAGES = require("../../utils/constants");

function registerDisconnect(socket, chatroomId) {
  const toiletId = socket.nsp.name.split("-")[1];
  const roomName = socket.handshake.query.room;
  const userId = socket.userId;

  socket.on("disconnect", async () => {
    try {
      if (chatroomId) {
        const chatList = await Chatroom.findById(chatroomId, "chatList");

        if (!chatList.length) {
          await Chatroom.findByIdAndDelete(chatroomId);
        } else {
          await Chatroom.findByIdAndUpdate(chatroomId, { isLive: false });
        }
      }
      await updateSOS(toiletId);

      socket.broadcast.to(roomName).emit("leaveChat");
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(ERROR_MESSAGES.FAILED_TO_COMMUNICATE_WITH_DB);
    }

    // eslint-disable-next-line no-console
    console.log(
      `User ${socket.id} ❌ disconnected from namespace 🚽toiletId-${toiletId} and left 🚪room ${userId}`
    );
  });
}

module.exports = registerDisconnect;
