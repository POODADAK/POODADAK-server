const expect = require("chai").expect;
const request = require("supertest");

const app = require("../../app");
const { validMockToilet, validMockReviewUserKAKAO } = require("../mockData");

describe("GET /toilets/", () => {
  const lat = 37.50770896206012;
  const lng = 127.06141576767008;
  it("should respond with 200 and get near toiletsList", async () => {
    const response = await request(app).get(`/toilets/?lat=${lat}&lng=${lng}`);

    expect(response.status).to.equal(200);
    expect(response.body.result).to.equal("ok");
    expect(response.body.toiletList.length).to.equal(1);
    expect(response.body.toiletList[0]).to.include({
      _id: validMockToilet._id,
      toiletType: validMockToilet.toiletType,
      toiletName: validMockToilet.toiletName,
      roadNameAddress: validMockToilet.roadNameAddress,
      indexNameAddress: validMockToilet.indexNameAddress,
      isUnisexToilet: validMockToilet.isUnisexToilet,
      menToiletBowlNumber: validMockToilet.menToiletBowlNumber,
      menUrinalNumber: validMockToilet.menUrinalNumber,
      menHandicapToiletBowlNumber: validMockToilet.menHandicapToiletBowlNumber,
      menHandicapUrinalNumber: validMockToilet.menHandicapUrinalNumber,
      menChildrenToiletBowlNumber: validMockToilet.menChildrenToiletBowlNumber,
      menChildrenUrinalNumber: validMockToilet.menChildrenUrinalNumber,
      ladiesToiletBowlNumber: validMockToilet.ladiesToiletBowlNumber,
      ladiesHandicapToiletBowlNumber:
        validMockToilet.ladiesHandicapToiletBowlNumber,
      ladiesChildrenToiletBowlNumber:
        validMockToilet.ladiesChildrenToiletBowlNumber,
      institutionName: validMockToilet.institutionName,
      phoneNumber: validMockToilet.phoneNumber,
      openTime: validMockToilet.openTime,
      installationYear: validMockToilet.installationYear,
      referenceDate: validMockToilet.referenceDate,
      institutionCode: validMockToilet.institutionCode,
      isSOS: validMockToilet.isSOS,
    });
  });
});

describe("GET /toilets/:toiletId", () => {
  it("should respond with 200 and get toilet", async () => {
    const response = await request(app).get(`/toilets/${validMockToilet._id}`);

    expect(response.status).to.equal(200);
    expect(response.body.result).to.equal("ok");
    expect(response.body.toilet).to.include({
      _id: validMockToilet._id,
      toiletType: validMockToilet.toiletType,
      toiletName: validMockToilet.toiletName,
      roadNameAddress: validMockToilet.roadNameAddress,
      indexNameAddress: validMockToilet.indexNameAddress,
      isUnisexToilet: validMockToilet.isUnisexToilet,
      menToiletBowlNumber: validMockToilet.menToiletBowlNumber,
      menUrinalNumber: validMockToilet.menUrinalNumber,
      menHandicapToiletBowlNumber: validMockToilet.menHandicapToiletBowlNumber,
      menHandicapUrinalNumber: validMockToilet.menHandicapUrinalNumber,
      menChildrenToiletBowlNumber: validMockToilet.menChildrenToiletBowlNumber,
      menChildrenUrinalNumber: validMockToilet.menChildrenUrinalNumber,
      ladiesToiletBowlNumber: validMockToilet.ladiesToiletBowlNumber,
      ladiesHandicapToiletBowlNumber:
        validMockToilet.ladiesHandicapToiletBowlNumber,
      ladiesChildrenToiletBowlNumber:
        validMockToilet.ladiesChildrenToiletBowlNumber,
      institutionName: validMockToilet.institutionName,
      phoneNumber: validMockToilet.phoneNumber,
      openTime: validMockToilet.openTime,
      installationYear: validMockToilet.installationYear,
      referenceDate: validMockToilet.referenceDate,
      institutionCode: validMockToilet.institutionCode,
      isSOS: validMockToilet.isSOS,
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
    const response = await request(app).get(`/toilets/${validMockToilet._id}`);

    expect(response.status).to.equal(200);
    expect(response.body.result).to.equal("ok");
    expect(response.body.toilet.reviewList[0]).to.include({
      _id: validMockReviewUserKAKAO._id,
      writer: validMockReviewUserKAKAO.writer,
      toilet: validMockReviewUserKAKAO.toilet,
      rating: validMockReviewUserKAKAO.rating,
      description: validMockReviewUserKAKAO.description,
      image: validMockReviewUserKAKAO.image,
      updatedAt: validMockReviewUserKAKAO.updatedAt,
    });
  });

  it("should NOT return reviewList with invalid toiletId", async () => {
    const toiletId = "invalidToiletId";
    const response = await request(app).get(`/toilets/review/:${toiletId}`);

    expect(response.status).to.equal(500);
    expect(response.body.result).to.equal("error");
  });
});
