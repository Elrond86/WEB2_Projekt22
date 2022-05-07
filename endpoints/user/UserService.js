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
function findUserBy(searchUserID, callback) {
    logger.debug(`UserService: searching for user with userID '${searchUserID}'...`)
    let query = User.findOne({ userID: searchUserID }) // query object erstellen
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
    user.ID = userData.ID
    user.userID = userData.userID
    user.userName = userData.userName
    user.password = userData.password
    user.isAdministrator = userData.isAdministrator
    //Object.assign(user.body, userData)
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

/* für Update (id darf nicht geändert werden)
delete userData.userID
 */



module.exports = { // 04
    getUsers,
    findUserBy,
    createUser,
}


/*
01 damit wir mit Userservice auf DB zugriefen können, brauchen wir Usermodel

02 in callbackmethode wird Ergebnis reingeschrieben. Callback methode wird übergeben beim Aufruf

03 find(x()) ist asynchrone function wo callback-methode erwaret wird. diese bekommt ein error-object und users, die wir als ergebnis zurück bekommen so werden bei mongoose immer callbacks ausgeführt: es werden 2 parameter übergeben: Errror-Objekt, falls ein Error Auftritt und das Ergebnis: der querry "users" 

04  exports in Array- Form, damit man später noch mehr Methoden einreihen kann, zum Exportieren

*/


/* function findUserBy(searchUserID, callback) {
    logger.debug("bin in findUsers")
    logger.debug("UserService: find User by ID: " + searchUserID)

    if (!searchUserID) {
        callback("UserID is missing")
        return
    }
    else {
        var query = User.findOne({ userID: searchUserID }) // query object erstellen
        query.exec(function (err, user) { //query wird asynchron ausgeführt
            if (err) {
                logger.debug("Did not find user for userID: " + searchUserID)
                return callback("Did not find user for userID: " + searchUserID, null)  // callback übergibt fehlernachricht
            }
            else {
                if (user) {
                    logger.debug(`Found userID: ${searchUserID}`)
                    callback(null, user)
                }
                else {
                    if ("admin" == searchUserID) {  //kommt nur, wenn ich mich als "admin" einloggen will und es diesen user nicht gibt.
                        console.log("Do not have admin account yet. Creating it with default password...")
                        var adminUser = new User()
                        adminUser.ID = ""
                        adminUser.userID = "admin"
                        adminUser.password = "123"
                        adminUser.userName = "Default Administrator Account"
                        adminUser.isAdministrator = true

                        adminUser.save(function (err) {
                            if (err) {
                                logger.debug("Could not create default admin account: " + err)
                                callback("Could not login to admin account", null)
                            }
                            else {
                                callback(null, adminUser)
                            }
                        })
                    }
                    else {
                        logger.debug("Could not find user for userID: " + searchUserID)
                        callback(null, user)  // das kommt dann zurück und wird da zurckgegeben als function-return: userService.findUserBy(props.userID, function (error, user)
                    }
                }
            }
        })
    }
} */