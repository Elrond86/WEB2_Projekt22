const mongoose = require("mongoose");

const ForumThreadSchema = new mongoose.Schema({
  name: String,
  description: String,
  ownerID: String,
  createdAt: { type: Date, immutable: true, default: () => Date.now() },
  updatedAt: { type: Date, default: () => Date.now() },
}, { timestamps: true }
);

const ForumThread = mongoose.model("ForumThread", ForumThreadSchema);

module.exports = ForumThread;


