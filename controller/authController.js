const url = require("url");

const axios = require("axios");
const jwt = require("jsonwebtoken");

const { createUser, getUser } = require("../service/user");

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

  res.json({ status: "ok" });
};

exports.signinKakao = async (req, res, next) => {
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
        process.env.KAKAO_REST_API_CLIENT_SECRET,
        {},
        {
          headers: {
            Authorization: `Bearer ${clientTokenVerificationResponse.data.access_token}`,
          },
        }
      );

      res.json("please select email too...");
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
      socialService: "KAKAO",
    });

    if (!currentUser) {
      const newUser = {
        username: fetchUserInfoResponse.data.kakao_account.profile.nickname,
        email: fetchUserInfoResponse.data.kakao_account.email,
        socialService: "KAKAO",
      };

      currentUser = await createUser(newUser);
    }

    createAndSendToken(currentUser, res);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
};
