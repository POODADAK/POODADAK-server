const io = require("socket.io")();

const verifyPoodadakTokenSocket = require("../middlewares/verifyPoodadakTokenSocket");
const Chatroom = require("../model/Chatroom");
const Toilet = require("../model/Toilet");
const { updateSOS } = require("../service/toilets");
const ERROR_MESSAGES = require("../utils/constants");
const { THIRTY_MINUTES } = require("../utils/constants").MINUTE_TO_MILLISECONDS;
const ErrorWithStatus = require("../utils/ErrorwithStatus");

const socketAPI = {
  io: io,
};

const toiletChatList = io.of(/^\/toiletId-/);

toiletChatList.use(verifyPoodadakTokenSocket);

toiletChatList.on("connection", async (socket) => {
  const toiletId = socket.nsp.name.split("-")[1];
  const userId = socket.userId;
  const roomName = socket.handshake.query.room;
  const roomDBId = socket.handshake.query.roomDBId;
  let chatroomId;

  socket.join(roomName);

  // eslint-disable-next-line no-console
  console.log(
    `User ${socket.id} ❗️connected to namespace 🚽toiletId-${toiletId} and joined 🚪room ${roomName}`
  );

  try {
    const connectedChatroom = await Chatroom.findById(roomDBId);
    if (connectedChatroom) {
      chatroomId = connectedChatroom._id;
    } else {
      const createdChatroom = await Chatroom.create({
        owner: userId,
        toilet: toiletId,
        isLive: true,
      });

      chatroomId = createdChatroom._id;
    }

    await Toilet.findByIdAndUpdate(toiletId, { isSOS: true });

    socket.emit("joinChatroom", chatroomId);
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

  let timerId = setTimeout(async () => {
    socket.disconnect(true);
  }, THIRTY_MINUTES);

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

    // console.log("rc", chat);
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
});

module.exports = socketAPI;
