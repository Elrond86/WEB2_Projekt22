const mongoose = require('mongoose');

const ForumThreadSchema = new mongoose.Schema({
  name: String,
  description: String,
  ownerID: String
}, { timestamps: true}
);

const ForumThread = mongoose.model('ForumThread', ForumThreadSchema);

module.exports = ForumThread;