const mongoose = require("mongoose");
const ForumThread = require("../forumThread/ForumThreadModel");
const User = require("../user/UserModel");
const logger = require("../../config/winston")

const ForumMessageSchema = new mongoose.Schema({
    forumThreadID: { type: String, require: true },
    parentThread_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "ForumThread",
        //default: () => forumThreadID
    },
    title: { type: String, require: true },
    text: { type: String, require: true },
    authorID: { type: String, require: true },
    author_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User"
    },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    createdAt: { type: Date, immutable: true, default: () => Date.now() },
    updatedAt: { type: Date, default: () => Date.now() }
}, { timestamps: true }
);


ForumMessageSchema.pre("save", async function (next) {
    
    this.parentThread_id = this.get("forumThreadID");
    
    var user = await User.findOne({userID : this.authorID}).select("_id")
    console.log("user: ")
    console.log(user)
    this.author_id = JSON.stringify(user).split('"')[3];
    this.author_id
    next();
})



const ForumMessage = mongoose.model("ForumMessage", ForumMessageSchema);

module.exports = ForumMessage;



