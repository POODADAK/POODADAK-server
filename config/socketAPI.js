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
  let chatroomId;

  socket.join(userId);

  // eslint-disable-next-line no-console
  console.log(
    `User ${socket.id} ❗️connected to namespace 🚽toiletId-${toiletId} and joined 🚪room ${userId}`
  );

  try {
    const createdChatroom = await Chatroom.create({
      owner: userId,
      toilet: toiletId,
      isLive: true,
    });

    await Toilet.findByIdAndUpdate(toiletId, { isSOS: true });

    chatroomId = createdChatroom._id;
    socket.emit("createChatroom", chatroomId);
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
    const { chatList } = await Chatroom.findById(chatroomId, "chatList");
    // console.log("!!!cl", chatList);
    socket.emit("findChatList", chatList);
  });

  socket.on("sendChat", async (payload) => {
    clearTimeout(timerId);

    timerId = setTimeout(async () => {
      socket.disconnect(true);
    }, THIRTY_MINUTES);

    // console.log("rc", payload);
    await Chatroom.findByIdAndUpdate(chatroomId, {
      $push: { chatList: payload },
    });

    socket.broadcast.to(userId).emit("receiveChat", payload);
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
