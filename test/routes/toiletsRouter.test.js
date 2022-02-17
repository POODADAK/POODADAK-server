const expect = require("chai").expect;
const request = require("supertest");

const app = require("../../app");

describe("GET /toilets/", () => {
  const lat = 37.50770896206012;
  const lng = 127.06141576767008;
  it("should respond with 200 and get near toiletsList", async () => {
    const response = await request(app).get(`/toilets/?lat=${lat}&lng=${lng}`);

    expect(response.status).to.equal(200);
    expect(response.body.result).to.equal("ok");
    expect(response.body.toiletList.length).to.equal(1);
    expect(response.body.toiletList[0]).to.include({
      _id: process.env.TEST_TOILET_ID,
      toiletType: "공중화장실",
      toiletName: "삼성",
      roadNameAddress: "서울특별시 강남구 테헤란로 지하538",
      indexNameAddress: "서울특별시 강남구 삼성동 172-82",
      isUnisexToilet: false,
      menToiletBowlNumber: 4,
      menUrinalNumber: 8,
      menHandicapToiletBowlNumber: 2,
      menHandicapUrinalNumber: 0,
      menChildrenToiletBowlNumber: 0,
      menChildrenUrinalNumber: 1,
      ladiesToiletBowlNumber: 13,
      ladiesHandicapToiletBowlNumber: 2,
      ladiesChildrenToiletBowlNumber: 0,
      institutionName: "서울교통공사",
      phoneNumber: "02-6110-2191",
      openTime: "05:00~01:00",
      installationYear: 2009,
      referenceDate: "2018-02-28",
      institutionCode: null,
      isSOS: true,
    });
  });
});

describe("GET /toilets/:toiletId", () => {
  it("should respond with 200 and get toilet", async () => {
    const response = await request(app).get(
      `/toilets/${process.env.TEST_TOILET_ID}`
    );

    expect(response.status).to.equal(200);
    expect(response.body.result).to.equal("ok");
    expect(response.body.toilet).to.include({
      _id: process.env.TEST_TOILET_ID,
      toiletType: "공중화장실",
      toiletName: "삼성",
      roadNameAddress: "서울특별시 강남구 테헤란로 지하538",
      indexNameAddress: "서울특별시 강남구 삼성동 172-82",
      isUnisexToilet: false,
      menToiletBowlNumber: 4,
      menUrinalNumber: 8,
      menHandicapToiletBowlNumber: 2,
      menHandicapUrinalNumber: 0,
      menChildrenToiletBowlNumber: 0,
      menChildrenUrinalNumber: 1,
      ladiesToiletBowlNumber: 13,
      ladiesHandicapToiletBowlNumber: 2,
      ladiesChildrenToiletBowlNumber: 0,
      institutionName: "서울교통공사",
      phoneNumber: "02-6110-2191",
      openTime: "05:00~01:00",
      installationYear: 2009,
      referenceDate: "2018-02-28",
      institutionCode: null,
      isSOS: true,
    });
  });

  it("should NOT return toilet with invalid toiletId", async () => {
    const toiletId = "invalidToiletId";
    const response = await request(app).get(`/toilets/${toiletId}`);

    expect(response.status).to.equal(500);
    expect(response.body.result).to.equal("error");
  });
});

describe("GET /review/:toiletId", () => {
  it("should respond with 200 and get reviewsList", async () => {
    const response = await request(app).get(
      `/toilets/${process.env.TEST_TOILET_ID}`
    );

    expect(response.status).to.equal(200);
    expect(response.body.result).to.equal("ok");
    expect(response.body.toilet.reviewList[0]).to.include({
      _id: process.env.TEST_REVIEW_ID_USER_KAKAO,
      writer: process.env.TEST_USER_ID_KAKAO,
      toilet: process.env.TEST_TOILET_ID,
      rating: 5,
      description: "배포성공 카카오",
      image:
        "https://poodadak-image.s3.ap-northeast-2.amazonaws.com/a59c4347690b0c6fb5edcbfc412eeb8a",
      updatedAt: "2022-02-18T08:31:50.922Z",
    });
  });

  it("should NOT return reviewList with invalid toiletId", async () => {
    const toiletId = "invalidToiletId";
    const response = await request(app).get(`/toilets/review/:${toiletId}`);

    expect(response.status).to.equal(500);
    expect(response.body.result).to.equal("error");
  });
});
