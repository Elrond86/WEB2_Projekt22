"use strict"

const logger = require("../../config/winston")
const ForumMessage = require("./ForumMessageModel")
const ForumThreadService = require("../forumThread/ForumThreadService");
const ForumThread = require("../forumThread/ForumThreadModel");
const { Console } = require("winston/lib/winston/transports");

/* create ForumMessage */
async function createFM(FMessageData) {
    if ( !FMessageData.body.title || !FMessageData.body.text || !FMessageData.body.forumThreadID ) {
        throw URIError('Title, Text and ThreadID fields are required !');
      }
      try{
          var thread = await ForumThread.findById(FMessageData.body.forumThreadID)
        }catch(err){
            throw err
        }
    if (thread == undefined || thread == null)  {
        
    }
    try {
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
        const messages = await ForumMessage.find({forumThreadID : ID})
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