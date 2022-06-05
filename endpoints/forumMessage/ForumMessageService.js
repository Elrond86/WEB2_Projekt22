"use strict"

const logger = require("../../config/winston")
const ForumMessage = require("./ForumMessageModel")
const ForumThreadService = require("../forumThread/ForumThreadService")


/* create ForumMessage */

async function createFM(FMessageData) {

    try {
        const FMessage = await ForumMessage.create({ 
            forumThreadID   : FMessageData.body.forumThreadID,
            parentThread    : FMessageData.body.forumThreadID,
            title           : FMessageData.body.title,
            text            : FMessageData.body.text,
            authorID        : FMessageData.user.userID,
            author          : FMessageData.user._id,   
        })
        logger.debug(FMessage)
        return FMessage
    } catch (err) {
        return err
    }
}

module.exports = {
    createFM,
}