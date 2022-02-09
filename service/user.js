const User = require("../model/User");

exports.getUser = async function (userInfo) {
  return await User.findOne(userInfo);
};

exports.createUser = async function (newUser) {
  return await User.create(newUser);
};

exports.getUserById = async function (id) {
  return await User.findById(id);
};
