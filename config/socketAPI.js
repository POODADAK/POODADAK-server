const io = require("socket.io")();

const verifyPoodadakTokenSocket = require("../middlewares/verifyPoodadakTokenSocket");

const socketAPI = {
  io: io,
};

io.use(verifyPoodadakTokenSocket);
// io.on("connection", (socket) => {});

module.exports = socketAPI;
