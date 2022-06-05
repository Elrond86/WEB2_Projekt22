const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    dateCreated: Date,
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

var Message = mongoose.model('Message', MessageSchema);
module.exports = Message;
