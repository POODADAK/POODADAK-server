const jwt = require("jsonwebtoken");

const { getUserById } = require("../service/user");

exports.verifyPoodadakToken = async (req, res, next) => {
  const fetchedToken = req.cookies.POODADAK_TOKEN;

  if (!fetchedToken) {
    res.status(404).json({
      result: "noToken",
    });

    return;
  }

  try {
    const { id } = await jwt.verify(fetchedToken, process.env.JWT_SECRET);
    const user = await getUserById(id);

    if (!user) {
      res.status(404).json({
        result: "noUser",
      });

      return;
    }

    req.userInfo = user;

    next();
  } catch (error) {
    next(error);
  }
};
