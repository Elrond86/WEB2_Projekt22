const ForumThread = require('./ForumThreadModel');
const logger = require("../../config/winston")


// create forumThread
function createForumThread(ThreadData, currentuser) {
    let ownerID = currentuser.userID
    
    logger.debug(JSON.stringify(ownerID))
    logger.debug(JSON.stringify(ThreadData))
    
    if (ownerID == null || ownerID == undefined) {
        return reject("no OwnerID", null)
    } 
    return new Promise((resolve, reject) => {
        logger.debug(`creating new ForumThread '${ThreadData.name}'`)
        let Thread = new ForumThread()
        Object.assign(Thread, ThreadData)
        logger.debug(`Thread object assigned with ThreadData '${ThreadData.name}'... Saving object in Database...`)
        Thread.save(function (err, Thread) {
            if (err) {
                logger.error("Could not create ForumThread: " + err)
                if (err.code = 1100) {
                    return reject("ForumThread already exists!", null)
                }
                return reject("Could not create ForumThread", null)
            }
            else {
                logger.debug("es sollte jetzt n statuscode 201 erzeugt")
                return resolve([null,201])
            }
        })

    })
}

// get all forumThreads
/* async function getForumThreads() {
    console.log("forumservice")
    const forums = (await ForumThread.find({}))
    return forums
}; */

function getForumThreads() {
    return new Promise( async (resolve, reject) => {
        const forums = await ForumThread.find({}) 
        //console.log(forums)
        if(forums){
            resolve([forums, 200])
        } 
        else {
            reject(null, 404)
        }
    })
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