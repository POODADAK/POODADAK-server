const expect = require("chai").expect;
const request = require("supertest");

const app = require("../../app");
const { SOCIAL_SERVICE, USER_LEVEL } = require("../../utils/constants");

describe("GET /profile/:userId", () => {
  it("should respond with 200 and get userProfile", async () => {
    const response = await request(app).get(
      `/profile/${process.env.TEST_USER_ID_NAVER}`
    );

    expect(response.status).to.equal(200);
    expect(response.body).to.include({
      _id: process.env.TEST_USER_ID_NAVER,
      username: "푸다닥-네이버",
      level: USER_LEVEL.BRONZE,
      email: "poodadak.naver@gmail.com",
      socialService: SOCIAL_SERVICE.NAVER,
    });
    expect(response.body.reviewList.length).to.equal(1);
    expect(response.body.reviewList[0]).to.include({
      _id: process.env.TEST_REVIEW_ID_USER_NAVER,
      writer: process.env.TEST_USER_ID_NAVER,
      rating: 5,
      description: "배포성공 네이버",
      image:
        "https://poodadak-image.s3.ap-northeast-2.amazonaws.com/a59c4347690b0c6fb5edcbfc412eeb8a",
      updatedAt: "2022-02-17T08:31:50.922Z",
    });
  });

  it("should NOT return userProfile with invalid userId", async () => {
    const userId = "invalidUserId";
    const response = await request(app).get(`/profile/${userId}`);

    expect(response.status).to.equal(500);
    expect(response.body.result).to.equal("error");
  });
});
