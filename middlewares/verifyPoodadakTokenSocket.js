const jwt = require("jsonwebtoken");

const { getUserById } = require("../service/user");

const verifyPoodadakTokenSocket = async (socket, next) => {
  try {
    const isTokenInHeader =
      socket.request.headers.cookie.startsWith("POODADAK_TOKEN");

    if (!isTokenInHeader) {
      throw new Error("no token in header!");
    }

    const fetchedToken = socket.request.headers.cookie.split("=")[1];
    const { id } = await jwt.verify(fetchedToken, process.env.JWT_SECRET);
    const user = await getUserById(id);

    if (!user) {
      throw new Error("no user!");
    }

    socket.userId = id;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = verifyPoodadakTokenSocket;
