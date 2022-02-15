const mongoose = require("mongoose");

const chatroomSchema = new mongoose.Schema({
  owner: {
    type: mongoose.ObjectId,
    isRequired: true,
    ref: "User",
  },
  participant: {
    type: mongoose.ObjectId,
    ref: "User",
    default: null,
  },
  chatList: {
    type: [
      {
        sender: mongoose.ObjectId,
        message: String,
        date: String,
      },
    ],
    default: [],
  },
  toilet: {
    type: mongoose.ObjectId,
    isRequired: true,
    ref: "Toilet",
  },
  isLive: {
    type: Boolean,
    isRequired: true,
  },
});

chatroomSchema.index({ toilet: -1 });

module.exports = mongoose.model("Chatroom", chatroomSchema);
