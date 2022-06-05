"use strict"

const logger = require("../../config/winston")
const ForumMessage = require("./ForumMessageModel")


/* create ForumMessage */

async function createFM(MessageData, author, parentThread) {
    
    try {
        const FMessage = await ForumMessage.create({ MessageData, author, parentThread })
        return FMessage
    } catch (err) {
        return err
    }
}

module.exports = {
    createFM,
}