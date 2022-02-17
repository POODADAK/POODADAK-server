const mongoose = require("mongoose");

const Review = require("../model/Review");
const Toilet = require("../model/Toilet");
const User = require("../model/User");
const { SOCIAL_SERVICE, USER_LEVEL } = require("../utils/constants");

exports.mochaHooks = {
  async beforeAll() {
    mongoose.connect(process.env.TEST_DB_LOCAL_URL);

    await Toilet.create({
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
      latestToiletPaperInfo: { lastDate: "", hasToiletPaper: false },
      location: { type: "Point", coordinates: [127.063067, 37.508826] },
      reviewList: [
        process.env.TEST_REVIEW_ID_USER_KAKAO,
        process.env.TEST_REVIEW_ID_USER_NAVER,
      ],
      isSOS: true,
    });

    await Review.create({
      _id: process.env.TEST_REVIEW_ID_USER_NAVER,
      writer: process.env.TEST_USER_ID_NAVER,
      toilet: process.env.TEST_TOILET_ID,
      rating: 5,
      hasToiletPaper: false,
      description: "배포성공 네이버",
      image:
        "https://poodadak-image.s3.ap-northeast-2.amazonaws.com/a59c4347690b0c6fb5edcbfc412eeb8a",
      updatedAt: "2022-02-17T08:31:50.922Z",
    });

    await Review.create({
      _id: process.env.TEST_REVIEW_ID_USER_KAKAO,
      writer: process.env.TEST_USER_ID_KAKAO,
      toilet: process.env.TEST_TOILET_ID,
      rating: 5,
      hasToiletPaper: false,
      description: "배포성공 카카오",
      image:
        "https://poodadak-image.s3.ap-northeast-2.amazonaws.com/a59c4347690b0c6fb5edcbfc412eeb8a",
      updatedAt: "2022-02-18T08:31:50.922Z",
    });

    await User.create({
      _id: process.env.TEST_USER_ID_NAVER,
      username: "푸다닥-네이버",
      level: USER_LEVEL.BRONZE,
      email: "poodadak.naver@gmail.com",
      socialService: SOCIAL_SERVICE.NAVER,
      reviewList: [process.env.TEST_REVIEW_ID_USER_NAVER],
    });

    await User.create({
      _id: process.env.TEST_USER_ID_KAKAO,
      username: "푸다닥-카카오",
      level: USER_LEVEL.BRONZE,
      email: "poodadak.kakao@gmail.com",
      socialService: SOCIAL_SERVICE.KAKAO,
      reviewList: [process.env.TEST_REVIEW_ID_USER_KAKAO],
    });
  },
  async afterEach() {
    const collections = Object.keys(mongoose.connection.collections);

    for (const collectionName of collections) {
      if (collectionName === "toilets") {
        await Toilet.deleteMany({ _id: { $ne: process.env.TEST_TOILET_ID } });
      } else if (collectionName === "reviews") {
        await Review.deleteMany({
          _id: {
            $nin: [
              process.env.TEST_REVIEW_ID_USER_NAVER,
              process.env.TEST_REVIEW_ID_USER_KAKAO,
            ],
          },
        });
      } else if (collectionName === "users") {
        await User.deleteMany({
          _id: {
            $nin: [
              process.env.TEST_USER_ID_KAKAO,
              process.env.TEST_USER_ID_NAVER,
            ],
          },
        });
      }
    }
  },
  async afterAll() {
    const collections = Object.keys(mongoose.connection.collections);

    for (const collectionName of collections) {
      const collection = mongoose.connection.collections[collectionName];
      await collection.deleteMany();
    }

    Object.keys(mongoose.connection.models).forEach((modelName) => {
      delete mongoose.connection.models[modelName];
    });
  },
};
