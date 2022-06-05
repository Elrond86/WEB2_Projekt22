"use strict"

const logger = require("../../config/winston")
const ForumMessage = require("./ForumMessageModel")
const ForumThreadService = require("../forumThread/ForumThreadService")


/* create ForumMessage */

async function createFM(FMessageData) {

    try {
        const FMessage = await ForumMessage.create({ 
            forumThreadID   : FMessageData.body.forumThreadID,
            title           : FMessageData.body.title,
            text            : FMessageData.body.text,
            authorID        : FMessageData.user.userID, 
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