//TODO: Komplett durchtesten
const Forum = require('./ForumModel')

function addForum(forumData, callback) {
    console.log("ForumService: Creating new Forum.")

    if (forumData) {
        let forumToAdd = new Forum()
        forumToAdd.forumName = forumData.forumName
        forumToAdd.forumDescription = forumData.forumDescription
        forumToAdd.ownerID = forumData.ownerID

        forumToAdd.save((error,forum) => {
            if (error) {
                callback(error)
                console.error("ForumService: Creation of new forum failed.")
            } else {
                callback({
                    _id: forum._id,
                    ownerID: forumData.ownerID
                }, forumToAdd)
            }
        })
    } else {
        return callback(`No Forum data found, could not add data.`)
    }
}

function findForumByName(forumNameToFind, callback) {
    if (forumNameToFind) {
        Forum.findOne({ forumName: forumNameToFind }).exec((error, forum) => {
            if (error) {
                return callback(`ForumService: No Forum with name ${ forumNameToFind } found.`)
            }
            else {
                if (forum) {
                    return callback(null, forum)
                }
                else {
                    let errorMessage = `ForumService: Found no Forum with name ${ forumNameToFind }`
                    console.error(errorMessage)
                    callback(errorMessage)
                }
            }
        })
    } else {
        callback(`ForumService: ForumName ${ forumNameToFind } is missing`)
    }
}

function findForumById(forumIdToFind, callback) {
    if (forumIdToFind) {
        Forum.findOne({ _id: forumIdToFind }).exec((error, forum) => {
            if (error) {
                return callback(`ForumService: No Forum with name ${ forumIdToFind } found.`)
            }
            else {
                if (forum) {
                    return callback(null, forum)
                }
                else {
                    let errorMessage = `ForumService: Found no Forum with name ${ forumIdToFind }`
                    console.error(errorMessage)
                    callback(errorMessage)
                }
            }
        })
    } else {
        callback(`ForumService: ForumName ${ forumIdToFind } is missing`)
    }
}

function updateForumData(newForumData, callback) {
    if (newForumData) {
        let filter = { '_id': newForumData._id }
        let newData = { 
            'forumDescription': newForumData.forumDescription,
            forumName: newForumData.forumName
         }

        Forum.findOneAndUpdate(filter, newData, {
            new: true,
            upsert: true
        }, (error, updatedForum) => {
            if (error) return callback(error)
            return callback(null, updatedForum)
        })
    } else {
        callback("Did not receive any forum data", null)
    }
}

function getAllForumsOfUser(ownerID, callback) {
    Forum.find({ ownerID: ownerID }, (error, forums) => {
        if (error) {
            console.log(`UserService: An error occured while trying to get all Forums of User ${ ownerID }!\n${ error }`);
            callback(error)
        } else {
            console.log(`UserService: Returning all Forums of User ${ ownerID }...`)
            callback(null, forums)
        }
    })
}

function deleteForum(forumID, callback) {
    Forum.findByIdAndRemove({ _id: forumID }, (error, document) => {
        if (!error) {
            console.log(`Forum with id ${ forumID } was deleted.`);
            console.log('test', callback);
            callback(null, document);
        }
        else { 
            console.log('Error! User could not be deleted: ' + error); 
            callback(error, null);
        }
    })
}

function getAllForums(callback) {
    Forum.find((error, forums) => {
        if (error) {
            //console.log(`UserService: An error occured while trying to get all Forums of User ${ ownerID }!\n${ error }`);
            return callback(error)
        } else {
            return callback(null, forums)
        }
    })
}

module.exports = {
    addForum, 
    findForumByName, 
    findForumById,
    updateForumData, 
    getAllForums, 
    getAllForumsOfUser, 
    deleteForum
}