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
async function getForumThreads() {
    logger.debug("Getting all ForumThreads...")
    const forums = await ForumThread.find({}).exec()
    return forums
}

/* find forumThread by ID */
async function getForumThreadByID (searchThreadID) {
    logger.debug(`searching for ForumThread with ThreadID: ${searchThreadID}...`)
    const forum = await ForumThread.findOne({ _id: searchThreadID }).exec()
    return forum
}

/* find all forumThreads by userID */
async function getForumThreadsByUserID (searchOwnerID) {
    logger.debug(`searching for ForumThreads with ownerID: ${searchOwnerID}...`)
    const userThreads = await ForumThread.find({ ownerID: searchOwnerID }).exec()
    return userThreads
}

/* update forumThread by ID */
async function updateForumThreadByID (searchThreadID, UpdateData) {
    logger.debug(`updating ForumThread with ThreadID: ${searchThreadID}...`)
    const Thread = await ForumThread.updateOne({ _id: searchThreadID }, UpdateData).exec()
    Object.assign(Thread, UpdateData)
    return Thread
}


/* delete forumThread by ID */
async function deleteThreadByID (searchThreadID) {
    logger.debug(`trying to delete the thread with with ${searchThreadID} now...`)
    try{
        const thread = await ForumThread.deleteOne({ "_id": searchThreadID })
        console.log(thread)
        logger.debug("success")
        return thread
    } catch(err) {
        return err
    }
}



/* delete All ForumThreads */
async function deleteAllThreads () {
    try{
        return await ForumThread.deleteMany({}).exec()
    } catch (err) {
        return err
    }
}


module.exports = {
    createForumThread,
    getForumThreads,
    getForumThreadByID,
    updateForumThreadByID,
    getForumThreadsByUserID,
    deleteThreadByID,
    deleteAllThreads
}
