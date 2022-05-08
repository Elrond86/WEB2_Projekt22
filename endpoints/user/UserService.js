const User = require("./Usermodel")  // 01
var config = require("config")
var logger = require("../../config/winston")
const { trusted } = require("mongoose/lib/helpers/query/trusted")

//get all users
function getUsers(callback) /* 02 */ {
    User.find(function (err, users) /* 01 */ {
        if (err) {
            logger.debug("Error while searching; " + err)
            return callback(err, null)  // Fehler wird zurückgegeben, user = null, also nicht zurück
        }
        else {
            logger.debug("All fine")
            return callback(null, users)  //err = null also kein Fehler zurück geben, sondern users
        }
    })
}

//find User by userID
function findUserBy(searchUserID, callback) { //UserService > findUserBy() callback
    logger.debug(`UserService: searching for user with userID '${searchUserID}'...`)
    const query = User.findOne({ userID: searchUserID }) // query object erstellen
    query.exec(function (err, user) { //query wird asynchron ausgeführt
        if (err) {
            logger.error(err.message)
            return callback(err.message)  // callback übergibt fehlernachricht
        }
        if (user) {  // hier wirkt null wie false
            logger.debug(`Found userID: ${searchUserID}`)
            callback(null, user)
        }
        else {
            //logger.error("Did not find user for userID: " + searchUserID)
            callback(`Did not find user with userID: ${searchUserID}`, user)  // callback übergibt fehlernachricht
        };
    })
}

//create User
function createUser(userData, callback) {
    logger.debug(`creating new User '${userData.userName}'`)
    let user = new User()
    Object.assign(user, userData)
    user.save(function (err) {
        if (err) {
            logger.debug("Could not create user account: " + err)
            callback("Could not create user account", null)
        }
        else {
            return callback(null, user)
        }
    })
}


/* für Update (id darf nicht geändert werden) */
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
    User.deleteOne({"userID": userID}, function (err, result) {
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

// FOR DEV ONLY delete all users
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

// update user by ID
function updateUserById(userID, body, callback) {
    User.findOne({ "userID": userID }, function(err, user) {
        if (user) {
            Object.assign(user, body);
            user.save( function (err) {
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





module.exports = { // 04
    getUsers,
    findUserBy,
    createUser,
    //updateUser,
    deleteUserById,
    updateUserById,
    deleteAllUsers,
    changeAdministratorStatus,
    updateUserById,
}


/*
01 damit wir mit Userservice auf DB zugriefen können, brauchen wir Usermodel

02 in callbackmethode wird Ergebnis reingeschrieben. Callback methode wird übergeben beim Aufruf

03 find(x()) ist asynchrone function wo callback-methode erwaret wird. diese bekommt ein error-object und users, die wir als ergebnis zurück bekommen so werden bei mongoose immer callbacks ausgeführt: es werden 2 parameter übergeben: Errror-Objekt, falls ein Error Auftritt und das Ergebnis: der querry "users" 

04  exports in Array- Form, damit man später noch mehr Methoden einreihen kann, zum Exportieren

*/
