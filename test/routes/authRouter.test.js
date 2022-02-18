const expect = require("chai").expect;
const httpMocks = require("node-mocks-http");
const proxyquire = require("proxyquire");
const sinon = require("sinon");
const request = require("supertest");

const app = require("../../app");
const { RESPONSE_RESULT } = require("../../utils/constants");
const signToken = require("../../utils/signToken");
const { validMockUserNAVER, validMockUserKAKAO } = require("../mockData");
const kakaoToken = signToken(validMockUserKAKAO._id);
const naverToken = signToken(validMockUserNAVER._id);
const noUserToken = signToken("620defbe86f47a3d02c771e1");
const invalidDBIDToken = signToken("invalidString");

describe("/kakao", () => {
  const request = httpMocks.createRequest({
    method: "GET",
    url: "/auth/kakao",
  });

  const response = httpMocks.createResponse();

  const fakeExpressNext = sinon.fake((error) => {
    response.statusCode = error.status;
    response.json();
  });

  const createFakeKakaoApiStub = (scope) => {
    return sinon
      .stub()
      .onCall(0)
      .returns({
        data: {
          scope: scope,
        },
      })
      .onCall(1)
      .returns({
        data: {
          kakao_account: {
            email: "poodadak.kakao@gmail.com",
          },
        },
      });
  };

  describe("success", () => {
    const fakeKakaoApi = createFakeKakaoApiStub("account_email");

    const signinKakao = proxyquire("../../controller/authController", {
      axios: {
        post: fakeKakaoApi,
      },
    }).signinKakao;

    it("should respond with 200, result: ok, and userId", async () => {
      await signinKakao(request, response, fakeExpressNext);

      expect(response._getStatusCode()).to.equal(200);
      expect(response._getJSONData().result).to.equal(RESPONSE_RESULT.OK);
      expect(response._getJSONData().userId).to.equal(validMockUserKAKAO._id);
    });
  });

  describe("fails", () => {
    it("should respond 401 when email is not provided", async () => {
      const fakeKakaoApi = createFakeKakaoApiStub("");

      const signinKakao = proxyquire("../../controller/authController", {
        axios: {
          post: fakeKakaoApi,
        },
      }).signinKakao;

      await signinKakao(request, response, fakeExpressNext);

      expect(response._getStatusCode()).to.equal(401);
    });

    it("should respond 500 when DB error happens", async () => {
      const fakeKakaoApi = createFakeKakaoApiStub(null);

      const signinKakao = proxyquire("../../controller/authController", {
        axios: {
          post: fakeKakaoApi,
        },
      }).signinKakao;

      await signinKakao(request, response, fakeExpressNext);

      expect(response._getStatusCode()).to.equal(500);
    });
  });
});

describe("/naver", () => {
  const request = httpMocks.createRequest({
    method: "GET",
    url: "/auth/naver",
    body: { code: "valid", state: "valid" },
  });

  const response = httpMocks.createResponse();

  const fakeExpressNext = sinon.fake((error) => {
    response.statusCode = error.status;
    response.json();
  });

  const createFakeNaverPostApiStub = (access_token, token_type) => {
    return sinon
      .stub()
      .onCall(0)
      .returns({
        data: {
          access_token,
          token_type,
        },
      })
      .onCall(1)
      .returns({});
  };

  const createFakeNaverGetApiStub = (email, nickname) => {
    return sinon
      .stub()
      .onCall(0)
      .returns({
        data: {
          response: {
            email,
            nickname,
          },
        },
      });
  };

  describe("success", () => {
    const fakeNaverPostApi = createFakeNaverPostApiStub(
      "validToken",
      "validType"
    );
    const fakeNaverGetApi = createFakeNaverGetApiStub(
      "poodadak.naver@gmail.com",
      "푸다닥-네이버"
    );
    const signinNaver = proxyquire("../../controller/authController", {
      axios: {
        post: fakeNaverPostApi,
        get: fakeNaverGetApi,
      },
    }).signinNaver;

    it("should respond with 200, result: ok, and userId", async () => {
      await signinNaver(request, response, fakeExpressNext);

      expect(response._getStatusCode()).to.equal(200);
      expect(response._getJSONData().result).to.equal(RESPONSE_RESULT.OK);
      expect(response._getJSONData().userId).to.equal(validMockUserNAVER._id);
    });
  });

  describe("fails", () => {
    it("should respond 401 when email is not provided", async () => {
      const fakeNaverPostApi = createFakeNaverPostApiStub(
        "validToken",
        "validType"
      );
      const fakeNaverGetApi = createFakeNaverGetApiStub("", "푸다닥-네이버");
      const signinNaver = proxyquire("../../controller/authController", {
        axios: {
          post: fakeNaverPostApi,
          get: fakeNaverGetApi,
        },
      }).signinNaver;

      await signinNaver(request, response, fakeExpressNext);

      expect(response._getStatusCode()).to.equal(401);
    });

    it("should respond 401 when nickname is not provided", async () => {
      const fakeNaverPostApi = createFakeNaverPostApiStub(
        "validToken",
        "validType"
      );
      const fakeNaverGetApi = createFakeNaverGetApiStub(
        "poodadak.naver@gmail.com",
        ""
      );
      const signinNaver = proxyquire("../../controller/authController", {
        axios: {
          post: fakeNaverPostApi,
          get: fakeNaverGetApi,
        },
      }).signinNaver;

      await signinNaver(request, response, fakeExpressNext);

      expect(response._getStatusCode()).to.equal(401);
    });

    it("should respond 500 when DB error happens", async () => {
      const fakeNaverPostApi = createFakeNaverPostApiStub(
        "validToken",
        "validType"
      );
      const fakeNaverGetApi = createFakeNaverGetApiStub({}, {});
      const signinNaver = proxyquire("../../controller/authController", {
        axios: {
          post: fakeNaverPostApi,
          get: fakeNaverGetApi,
        },
      }).signinNaver;

      await signinNaver(request, response, fakeExpressNext);

      expect(response._getStatusCode()).to.equal(500);
    });
  });
});

describe("/token-elimination", () => {
  it("should respond with 200 and 'POODADAK_TOKEN=;' set-cookie header", async () => {
    const response = await request(app).post("/auth/token-elimination");

    expect(response.status).to.equal(200);
    expect(response.header).to.have.own.property("set-cookie");
    expect(response.header["set-cookie"][0]).to.include("POODADAK_TOKEN=;");
  });
});

describe("/token-verification", () => {
  describe("success", () => {
    describe("kakao token", () => {
      it("should respond with 200, userId, and verified result", async () => {
        const response = await request(app)
          .post("/auth/token-verification")
          .set("Cookie", `POODADAK_TOKEN=${kakaoToken}`);

        expect(response.status).to.equal(200);
        expect(response.body.result).to.equal(RESPONSE_RESULT.VERIFIED);
        expect(response.body.userId).to.equal(validMockUserKAKAO._id);
      });
    });

    describe("naver token", () => {
      it("should respond with 200, userId, and verified result", async () => {
        const response = await request(app)
          .post("/auth/token-verification")
          .set("Cookie", `POODADAK_TOKEN=${naverToken}`);

        expect(response.status).to.equal(200);
        expect(response.body.result).to.equal(RESPONSE_RESULT.VERIFIED);
        expect(response.body.userId).to.equal(validMockUserNAVER._id);
      });
    });
  });

  describe("fail", () => {
    it("should fail with 400 when there's no token", async () => {
      const response = await request(app).post("/auth/token-verification");

      expect(response.status).to.equal(400);
    });

    it("should fail with 404 when token has no matching user", async () => {
      const response = await request(app)
        .post("/auth/token-verification")
        .set("Cookie", `POODADAK_TOKEN=${noUserToken}`);

      expect(response.status).to.equal(404);
    });

    it("should fail with 401 when token is invalid", async () => {
      const response = await request(app)
        .post("/auth/token-verification")
        .set("Cookie", "POODADAK_TOKEN=invalid");

      expect(response.status).to.equal(401);
    });

    it("should fail with 401 when there's DB Error", async () => {
      const response = await request(app)
        .post("/auth/token-verification")
        .set("Cookie", `POODADAK_TOKEN=${invalidDBIDToken}`);

      expect(response.status).to.equal(500);
    });
  });
});
