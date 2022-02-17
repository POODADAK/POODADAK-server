const mongoose = require("mongoose");

const Toilet = require("../model/Toilet");

exports.mochaHooks = {
  async beforeAll() {
    mongoose.connect(process.env.TEST_DB_LOCAL_URL);

    await Toilet.create({
      _id: "6207aa5a38ccf2084f90c13f",
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
      reviewList: [],
      isSOS: true,
    });
  },
  async afterEach() {
    const collections = Object.keys(mongoose.connection.collections);

    for (const collectionName of collections) {
      if (collectionName === "toilets") {
        await Toilet.deleteMany({ _id: { $ne: "6207aa5a38ccf2084f90c13f" } });
      } else {
        const collection = mongoose.connection.collections[collectionName];
        await collection.deleteMany();
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
