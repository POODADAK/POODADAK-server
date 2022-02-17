const mongoose = require("mongoose");

exports.mochaHooks = {
  async beforeAll() {
    const databaseName = "test";

    Object.keys(mongoose.connection.models).forEach((modelName) => {
      delete mongoose.connection.models[modelName];
    });

    await mongoose.connect(`mongodb://127.0.0.1/${databaseName}`, {
      useNewUrlParser: true,
    });
  },
  async afterEach() {
    const collections = Object.keys(mongoose.connection.collections);

    for (const collectionName of collections) {
      const collection = mongoose.connection.collections[collectionName];
      await collection.deleteMany();
    }
  },
  async afterAll() {
    await mongoose.connection.close();
  },
};
