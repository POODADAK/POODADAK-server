const mongoose = require("mongoose");

const Review = require("../model/Review");
const Toilet = require("../model/Toilet");
const User = require("../model/User");
const {
  validMockToilet,
  validMockUserNAVER,
  validMockUserKAKAO,
  validMockReviewUserNAVER,
  validMockReviewUserKAKAO,
} = require("./mockData");

exports.mochaHooks = {
  async beforeAll() {
    mongoose.connect(process.env.TEST_DB_LOCAL_URL);

    await Toilet.create(validMockToilet);

    await User.create(validMockUserNAVER);

    await User.create(validMockUserKAKAO);

    await Review.create(validMockReviewUserNAVER);

    await Review.create(validMockReviewUserKAKAO);
  },
  async afterEach() {
    const collections = Object.keys(mongoose.connection.collections);

    for (const collectionName of collections) {
      if (collectionName === "toilets") {
        await Toilet.deleteMany({ _id: { $ne: validMockToilet._id } });
      } else if (collectionName === "users") {
        await User.deleteMany({
          _id: {
            $nin: [validMockUserNAVER._id, validMockUserKAKAO._id],
          },
        });
      } else if (collectionName === "reviews") {
        await Review.deleteMany({
          _id: {
            $nin: [validMockReviewUserNAVER._id, validMockReviewUserKAKAO._id],
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
