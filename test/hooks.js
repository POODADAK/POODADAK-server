const mongoose = require("mongoose");

exports.mochaHooks = {
  async beforeAll() {
    //모든 테스트 실행이전 필요한 작업이 있을경우 채워주시기 바랍니다.
  },
  async afterEach() {
    const collections = Object.keys(mongoose.connection.collections);

    for (const collectionName of collections) {
      const collection = mongoose.connection.collections[collectionName];
      await collection.deleteMany();
    }
  },
  async afterAll() {
    Object.keys(mongoose.connection.models).forEach((modelName) => {
      delete mongoose.connection.models[modelName];
    });
  },
};
