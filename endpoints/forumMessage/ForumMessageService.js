"use strict"

const logger = require("../../config/winston")
const ForumMessage = require("./ForumMessageModel")
const ForumThreadService = require("../forumThread/ForumThreadService");
//const ForumThread = require("../forumThread/ForumThreadModel");

/* create ForumMessage */

async function createFM(FMessageData) {

    try {
        //if(!ForumThread.exists({_id : "FMessageData.body.forumThreadID"})) throw ReferenceError
        const FMessage = await ForumMessage.create({
            forumThreadID: FMessageData.body.forumThreadID,
            title: FMessageData.body.title,
            text: FMessageData.body.text,
            authorID: FMessageData.user.userID,
        })
        logger.debug(FMessage)
        return FMessage
    } catch (err) {
        return err
    }
}

/* get all Forum Messages for a ForumThreadID */
async function getForumThreads(ID) {
    try {
        const messages = await ForumMessage.where("forumThreadID").equals(ID)
        return messages
    } catch (err) {
        return err
    }
}


async function getForumMessageById(blub) { bla}


module.exports = {
    createFM,
    getForumThreads,
    getForumMessageById
}