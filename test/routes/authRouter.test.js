const expect = require("chai").expect;
const httpMocks = require("node-mocks-http");
const proxyquire = require("proxyquire");
const sinon = require("sinon");
const request = require("supertest");

const app = require("../../app");
const { RESPONSE_RESULT } = require("../../utils/constants");
const signToken = require("../../utils/signToken");
const kakaoToken = signToken(process.env.TEST_USER_ID_KAKAO);
// const naverToken = signToken(process.env.TEST_USER_ID_NAVER);
const noUserToken = signToken(process.env.TEST_USER_ID_NOT_IN_DB);
const invalidDBIDToken = signToken(
  process.env.TEST_USER_ID_INVALID_DB_OBJECT_ID
);

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
      expect(response._getJSONData().userId).to.equal(
        process.env.TEST_USER_ID_KAKAO
      );
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
  it("should respond with 200, userId, and verified result", async () => {
    const response = await request(app)
      .post("/auth/token-verification")
      .set("Cookie", `POODADAK_TOKEN=${kakaoToken}`);

    expect(response.status).to.equal(200);
    expect(response.body.result).to.equal(RESPONSE_RESULT.VERIFIED);
    expect(response.body.userId).to.equal(process.env.TEST_USER_ID_KAKAO);
  });

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
