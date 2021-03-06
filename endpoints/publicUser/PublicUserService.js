const User = require("../user/UserModel")
var config = require("config")
var logger = require("../../config/winston")
const { trusted } = require("mongoose/lib/helpers/query/trusted")


// create User
async function createUser(userData) {
    return new Promise((resolve, reject) => {
        if (!userData.userID) {
            reject("You can not create a user without a userID")
        }
        else {
            logger.debug(`creating new User '${userData.userName}'`)
            let user = new User()
            Object.assign(user, userData)
            logger.debug(`saving new User '${JSON.stringify(user)}'`)
            user.save(function (err, user) {
                if (err) {
                    logger.error("Could not create user account: " + err.message)
                    //console.log(err.errors)
                    if (err.code == 1100) {
                        reject("User already exists!")
                    }
                    reject("Could not create user account")
                }
                else {
                    logger.debug(user)
                    resolve(user)
                }
            })
        }
    })
}

// ensure admin is in db


//find User by userID
function findUserBy(searchUserID, callback) {
    logger.debug(`UserService: searching for user with userID '${searchUserID}'...`)
    const query = User.findOne({ userID: searchUserID })
    query.exec(function (err, user) {
        if (err) {
            logger.error(err.message)
            return callback(err.message)
        }
        if (user) {
            logger.debug(`Found userID: ${searchUserID}`)
            callback(null, user)
        }
        else {
            logger.error("Did not find user for userID: " + searchUserID)
            callback(`Did not find user with userID: ${searchUserID}`, user)
        };
    })
}


// update User
function updateUserById(userID, body, callback) {
    User.findOne({ "userID": userID }, function (err, user) {
        if (user) {
            Object.assign(user, body);
            user.save(function (err) {
                if (err) {
                    callback(err, null, 500);
                } else {
                    const { userID, userName, isAdministrator, password, email, createdAt, updatedAt, ...partialObject } = user;
                    const subset = { userID, userName, isAdministrator, password, email, createdAt, updatedAt };
                    callback(null, subset, 200);
                }
            });
        } else {
            callback(`No user with ID ${userID} found`, null, 404);
        }
    });
};

// delete user by ID
function deleteUserById(userID, callback) {
    User.deleteOne({ "userID": userID }, function (err, result) {
        if (err) {
            callback('Internal Server Error', null, 500);
        } else {
            if (result.deletedCount == 0) {
                callback(`No user with ID ${userID} found`, null, 404);
            } else {
                callback(`User with ID ${userID} succesfully deleted`, true, 204);
            };
        }
    });
}

// delete all users
function deleteAllUsers(callback) {
    User.deleteMany({}, function (err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result);
        }
    });
};

// change admin status
function changeAdministratorStatus(userID, isAdministrator, callback) {
    if (isAdministrator != 'true' && isAdministrator != 'false') {
        callback('Please provide a valid value for isAdministrator', null, 400);
    } else {
        User.findOneAndUpdate({
            "userID": userID
        }, {
            "isAdministrator": isAdministrator
        }, {
            returnOriginal: false,
            rawResult: true
        }, function (err, result) {
            if (err) {
                callback(`Internal Server Error`, null, 500);
            } else {
                if (result.lastErrorObject.updatedExisting == false) {
                    callback(`No user with ID ${userID} found`, null, 404);
                } else {
                    callback(null, result.value, 200);
                }
            }
        }).select({
            "_id": 0,
            "__v": 0
        });
    }
}

//get all users
function getUsers(callback) {
    User.find(function (err, users) {
        if (err) {
            logger.debug("Error while searching; " + err)
            return callback(err, null)
        }
        else {
            logger.debug("All fine")
            return callback(null, users)
        }
    })
}

module.exports = {
    getUsers,
    findUserBy,
    createUser,
    deleteUserById,
    updateUserById,
    deleteAllUsers,
    changeAdministratorStatus,
    updateUserById,
}