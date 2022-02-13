const io = require("socket.io")();

const verifyPoodadakTokenSocket = require("../middlewares/verifyPoodadakTokenSocket");
const Chatroom = require("../model/Chatroom");
const ERROR_MESSAGES = require("../utils/constants");
const ErrorWithStatus = require("../utils/ErrorwithStatus");

const socketAPI = {
  io: io,
};

const toiletChatList = io.of(/^\/toiletId-/);

toiletChatList.use(verifyPoodadakTokenSocket);

toiletChatList.on("connection", async (socket) => {
  const toiletId = socket.nsp.name.split("-")[1];
  let createdChatroomDocument;

  socket.join(socket.userId);

  // eslint-disable-next-line no-console
  console.log(
    `User ${socket.id} connected to namespace 🚽toiletId-${toiletId} and joined 🚪room ${socket.userId}`
  );

  try {
    //소켓이 연결되면 DB에 chatroom 도큐먼트 생성.
    createdChatroomDocument = await Chatroom.create({
      owner: socket.userId,
      toilet: toiletId,
      isLive: true,
    });
  } catch (error) {
    socket.emit(
      "db-error",
      new ErrorWithStatus(
        error,
        500,
        ERROR_MESSAGES.FAILED_TO_COMMUNICATE_WITH_DB
      ).toPlainSocketErrorObject()
    );
  }

  //채팅이 30분간 없으면 채팅창 종료.
  let timerId = setTimeout(async () => {
    socket.disconnect(true);
    //소켓연결이 끊길때 해당 chatroom 도큐먼트 isLive 업데이트
    if (createdChatroomDocument) {
      createdChatroomDocument.update({ isLive: false });
    }
  }, 2000);

  socket.on("sendMessage", () => {
    //채팅이 생길경우 채팅창 종료시간 연장.
    clearTimeout(timerId);
    timerId = setTimeout(async () => {
      socket.disconnect(true);
      if (createdChatroomDocument) {
        createdChatroomDocument.update({ isLive: false });
      }
    }, 1800000);
  });
});

module.exports = socketAPI;
