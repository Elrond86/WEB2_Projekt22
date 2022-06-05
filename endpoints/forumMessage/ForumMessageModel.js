const mongoose = require("mongoose");
const ForumThread = require("../forumThread/ForumThreadModel");
const User = require("../user/UserModel");

const ForumMessageSchema = new mongoose.Schema({
    forumThreadID: { type: String, require: true },
    parentThread: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "ForumThread",
        //default: () => forumThreadID
    },
    title: { type: String, require: true },
    text: { type: String, require: true },
    authorID: { type: String, require: true },
    author: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User"
    },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    createdAt: { type: Date, immutable: true, default: () => Date.now() },
    updatedAt: { type: Date, default: () => Date.now() }
}, { timestamps: true }
);


/* ForumMessageSchema.pre("save", function (next) {
    this.parentThread = this.get("forumThreadID");
    this.author = this.get(authorID);
    next();
}) */



const ForumMessage = mongoose.model("ForumMessage", ForumMessageSchema);

module.exports = ForumMessage;



