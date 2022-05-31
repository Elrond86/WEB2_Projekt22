const mongoose = require('mongoose')

const ForumSchema = new mongoose.Schema({
    forumName: { type: String, unique: true, minlength: 2, maxlength: 20 },
    forumDescription: { type: String, minlength: 1, maxlength: 300 },
    ownerID: { type: String }
})

const Forum = mongoose.model("Forum", ForumSchema)
module.exports = Forum