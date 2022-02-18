const expect = require("chai").expect;
const request = require("supertest");

const app = require("../../app");
const { validMockUserNAVER, validMockReviewUserNAVER } = require("../mockData");

describe("profileRouter TEST", () => {
  describe("GET /profile/:userId", () => {
    it("should respond with 200 and get userProfile", async () => {
      const response = await request(app).get(
        `/profile/${validMockUserNAVER._id}`
      );

      expect(response.status).to.equal(200);
      expect(response.body).to.include({
        _id: validMockUserNAVER._id,
        username: validMockUserNAVER.username,
        level: validMockUserNAVER.level,
        email: validMockUserNAVER.email,
        socialService: validMockUserNAVER.socialService,
      });
      expect(response.body.reviewList.length).to.equal(1);
      expect(response.body.reviewList[0]).to.include({
        _id: validMockReviewUserNAVER._id,
        writer: validMockReviewUserNAVER.writer,
        rating: validMockReviewUserNAVER.rating,
        description: validMockReviewUserNAVER.description,
        image: validMockReviewUserNAVER.image,
        updatedAt: validMockReviewUserNAVER.updatedAt,
      });
    });

    it("should NOT return userProfile with invalid userId", async () => {
      const userId = "invalidUserId";
      const response = await request(app).get(`/profile/${userId}`);

      expect(response.status).to.equal(500);
      expect(response.body.result).to.equal("error");
    });
  });
});
