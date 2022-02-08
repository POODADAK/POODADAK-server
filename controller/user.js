const axios = require("axios");
const jwt = require("jsonwebtoken");

const userService = require("../service/user");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
};

const createAndSendToken = (user, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(Date.now() + Number(process.env.JWT_EXPIRE_TIME)),
    httpOnly: true,
  };

  res.cookie("jwt", token, cookieOptions);

  res.json({
    result: "ok",
    socialService: "NAVER",
  });
};

exports.auth = async (req, res, next) => {
  const { code, state } = req.body;

  if (!code || !state) {
    res.json({
      result: "error",
      errMessage:
        "ERROR: fail to authenticate from Naver server with your data.",
    });
  }

  try {
    const token = await axios.get(
      `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${process.env.NAVER_CLIENT_ID}&client_secret=${process.env.NAVER_CLIENT_SECRET}&code=${code}&state=${state}`
    );

    const { access_token, token_type } = token.data;
    const { data } = await axios.get("https://openapi.naver.com/v1/nid/me", {
      headers: {
        Authorization: `${token_type} ${access_token}`,
      },
    });

    const { email, nickname } = data.response;

    if (!email || !nickname) {
      res.json({
        result: "error",
        errMessage: "Please, login again",
      });
    }

    let userInfo = await userService.getUser({ email, socialService: "NAVER" });

    if (!userInfo) {
      userInfo = await userService.createUser(userInfo);
    }

    createAndSendToken(userInfo, res);
  } catch (error) {
    next(error);
  }
};
