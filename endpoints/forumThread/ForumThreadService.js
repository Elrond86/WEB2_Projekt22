const ForumThread = require('./ForumThreadModel');
const logger = require("../../config/winston");
const res = require('express/lib/response');


// create forumThread
function createForumThread(ThreadData, currentuser) {
    if (currentuser.userID == null || currentuser.userID == undefined) {
        return ("no OwnerID")
    }
    return new Promise((resolve, reject) => {
        logger.debug(`creating new ForumThread '${ThreadData.name}'`)
        let Thread = new ForumThread()
        Object.assign(Thread, ThreadData)
        Thread.ownerID = currentuser.userID
        Thread.save(function (err, Thread) {
            if (err) {
                logger.error("Could not create ForumThread: " + err)
                reject("Could not create ForumThread")
            }
            else {
                logger.debug("Thread created. Reporting to router...")
                resolve(Thread)
            }
        })
    })
}

/* get all threads */

function getForumThreads() {
    logger.debug("Getting all ForumThreads...")
    const forums = ForumThread.find({}).exec()
    console.log(forums)
    return forums
}




// find forumThread by ID
const getForumThreadById = (threadID, callback) => {

};

// find forumThread by userID
const getForumThreadsByUserId = (ownerID, callback) => {

};

const updateForumThreadById = (threadID, body, userID, isAdministrator, callback) => {

};

// delete forumThread by ID
const deleteForumThreadById = (threadID, userID, isAdministrator, callback) => {
};

module.exports = {
    createForumThread,
    getForumThreads,
    getForumThreadById,
    updateForumThreadById,
    getForumThreadsByUserId,
    deleteForumThreadById
}