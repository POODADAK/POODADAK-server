const url = require("url");

const axios = require("axios");
const jwt = require("jsonwebtoken");

const { createUser, getUser } = require("../service/user");

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
}

function createAndSendToken(user, res) {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(Date.now() + Number(process.env.JWT_EXPIRE_TIME)),
    httpOnly: true,
  };

  res.cookie("POODADAK_TOKEN", token, cookieOptions);
  res.json({
    result: "ok",
  });
}

exports.signinKakao = async (req, res, next) => {
  const socialService = "KAKAO";

  try {
    const params = new url.URLSearchParams({
      grant_type: "authorization_code",
      client_id: process.env.KAKAO_REST_API_KEY,
      redirect_uri: process.env.KAKAO_REST_API_REDIRECT_URL,
      code: req.body.token,
      client_secret: process.env.KAKAO_REST_API_CLIENT_SECRET,
    });

    const clientTokenVerificationResponse = await axios.post(
      process.env.KAKAO_REST_API_VERIFY_TOKEN_URL,
      params.toString(),
      {
        headers: {
          "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      }
    );

    const didUserApproveEmail =
      clientTokenVerificationResponse.data.scope.includes("account_email");

    if (!didUserApproveEmail) {
      await axios.post(
        process.env.KAKAO_REST_API_UNLINK_USER_URL,
        {},
        {
          headers: {
            Authorization: `Bearer ${clientTokenVerificationResponse.data.access_token}`,
          },
        }
      );

      res.status(401).json({
        result: "error",
        errMessage: "Please, login again, select email & nickname too...",
      });

      return;
    }

    const fetchUserUrlParams = new url.URLSearchParams({
      property_keys:
        '["kakao_account.email", "kakao_account.profile.nickname"]',
    });

    const fetchUserInfoResponse = await axios.post(
      process.env.KAKAO_REST_API_FETCH_USER_INFO_URL,
      fetchUserUrlParams.toString(),
      {
        headers: {
          Authorization: `Bearer ${clientTokenVerificationResponse.data.access_token}`,
          "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      }
    );

    let currentUser = await getUser({
      email: fetchUserInfoResponse.data.kakao_account.email,
      socialService,
    });

    if (!currentUser) {
      const newUser = {
        username: fetchUserInfoResponse.data.kakao_account.profile.nickname,
        email: fetchUserInfoResponse.data.kakao_account.email,
        socialService,
      };

      currentUser = await createUser(newUser);
    }

    createAndSendToken(currentUser, res);
  } catch (error) {
    next(error);
  }
};

exports.signinNaver = async (req, res, next) => {
  const socialService = "NAVER";
  const { code, state } = req.body;

  if (!code || !state) {
    res.status(401).json({
      result: "error",
      errMessage:
        "ERROR: fail to authenticate from Naver server with your data.",
    });

    return;
  }

  try {
    const params = new url.URLSearchParams({
      grant_type: "authorization_code",
      client_id: process.env.NAVER_API_CLIENT_ID,
      client_secret: process.env.NAVER_API_CLIENT_SECRET,
      code,
      state,
    });

    const token = await axios.post(
      process.env.NAVER_API_GET_TOKEN_URL,
      params.toString()
    );

    const { access_token, token_type } = token.data;
    const { data } = await axios.get(process.env.NAVER_API_GET_USER_INFO_URL, {
      headers: {
        Authorization: `${token_type} ${access_token}`,
      },
    });

    const { email, nickname } = data.response;

    if (!email || !nickname) {
      const params = new url.URLSearchParams({
        client_id: process.env.NAVER_API_CLIENT_ID,
        client_secret: process.env.NAVER_API_CLIENT_SECRET,
        access_token,
        grant_type: "delete",
        service_provider: "Naver",
      });

      await axios.post(
        process.env.NAVER_REST_API_UNLINK_USER_URL,
        params.toString(),
        {
          headers: {
            "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
          },
        }
      );

      res.status(401).json({
        result: "error",
        errMessage: "Please, login again, select email & nickname too...",
      });

      return;
    }

    let userInfo = await getUser({ email, socialService });

    if (!userInfo) {
      const newUser = {
        username: nickname,
        email,
        socialService,
      };
      userInfo = await createUser(newUser);
    }

    createAndSendToken(userInfo, res);
  } catch (error) {
    next(error);
  }
};

exports.eraseCookie = (req, res, next) => {
  res.clearCookie("POODADAK_TOKEN");
  res.json({
    result: "deleted",
  });
};
