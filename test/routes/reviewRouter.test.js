const expect = require("chai").expect;
const request = require("supertest");

const app = require("../../app");
const signToken = require("../../utils/signToken");

describe("GET /review/:reviewId", () => {
  it("should respond with 200 and get review", async () => {
    const response = await request(app).get(
      `/review/${process.env.TEST_REVIEW_ID_USER_NAVER}`
    );

    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal({
      _id: process.env.TEST_REVIEW_ID_USER_NAVER,
      toilet: process.env.TEST_TOILET_ID,
      rating: 5,
      hasToiletPaper: false,
      description: "배포성공 네이버",
      image:
        "https://poodadak-image.s3.ap-northeast-2.amazonaws.com/a59c4347690b0c6fb5edcbfc412eeb8a",
    });
  });
});

describe("POST /review", () => {
  const token = signToken(process.env.TEST_USER_ID_NAVER);

  const newReview = {
    writer: process.env.TEST_USER_ID_NAVER,
    toilet: process.env.TEST_TOILET_ID,
    rating: 5,
    description: "깨끗한 화장실 !!",
    image:
      "https://poodadak-image.s3.ap-northeast-2.amazonaws.com/a59c4347690b0c6fb5edcbfc412eeb8a",
    updatedAt: "2022-02-17T08:31:50.922Z",
  };

  it("should respond with 200 and review is saved in the database.", async () => {
    const response = await request(app)
      .post("/review")
      .set("Cookie", `POODADAK_TOKEN=${token}`)
      .send(newReview);

    expect(response.status).to.equal(200);
    expect(response.body.result).to.equal("ok");
    expect(response.body.review).to.include({
      writer: process.env.TEST_USER_ID_NAVER,
      toilet: process.env.TEST_TOILET_ID,
      rating: 5,
      description: "깨끗한 화장실 !!",
      image:
        "https://poodadak-image.s3.ap-northeast-2.amazonaws.com/a59c4347690b0c6fb5edcbfc412eeb8a",
      updatedAt: "2022-02-17T08:31:50.922Z",
    });
  });

  it("review should not be saved in the database with empty description.", async () => {
    const descriptionsNullReview = newReview;
    descriptionsNullReview.description = "";

    const response = await request(app)
      .post("/review")
      .set("Cookie", `POODADAK_TOKEN=${token}`)
      .send(newReview);

    expect(response.status).to.equal(500);
    expect(response.body.result).to.equal("error");
  });
});

describe("POST /review/:reviewId", () => {
  const token = signToken(process.env.TEST_USER_ID_NAVER);

  const submittedReview = {
    toilet: process.env.TEST_TOILET_ID,
    rating: 5,
    description: "휴지가 있네용",
    image:
      "https://poodadak-image.s3.ap-northeast-2.amazonaws.com/a59c4347690b0c6fb5edcbfc412eeb8a",
    hasToiletPaper: true,
    updatedAt: "2022-02-17T08:31:50.922Z",
  };

  const params = process.env.TEST_REVIEW_ID_USER_NAVER;

  it("should respond with 200 and review needs to be modified.", async () => {
    const response = await request(app)
      .post(`/review/${params}`)
      .set("Cookie", `POODADAK_TOKEN=${token}`)
      .send(submittedReview);

    expect(response.status).to.equal(200);
    expect(response.body.result).to.equal("ok");
  });

  it("review should not get modified with empty description.", async () => {
    submittedReview.description = "";

    const response = await request(app)
      .post(`/review/${params}`)
      .set("Cookie", `POODADAK_TOKEN=${token}`)
      .send(submittedReview);

    expect(response.status).to.equal(500);
    expect(response.body.result).to.equal("error");
  });
});

describe("DELETE /review/:reviewId", () => {
  const token = signToken(process.env.TEST_USER_ID_NAVER);

  const params = process.env.TEST_REVIEW_ID_USER_NAVER;

  it("should review needs to be delete", async () => {
    const response = await request(app)
      .delete(`/review/${params}`)
      .set("Cookie", `POODADAK_TOKEN=${token}`);

    expect(response.status).to.equal(200);
    expect(response.body.result).to.equal("ok");
  });
});
