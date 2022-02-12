const verifyPoodadakTokenSocket = (socket, next) => {
  try {
    //쿠키토큰 증명 로직 작성하기

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = verifyPoodadakTokenSocket;
