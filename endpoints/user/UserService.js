const User = require("./Usermodel")  // 01
var config = require("config")
var logger = require("../../config/winston")


function getUsers(callback) /* 02 */ {
    // console.log("bin in getUsers")
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

function findUserBy(searchUserID, callback) {
    // logger.debug("bin in findUsers")
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
                logger.debug(`Found userID: ${searchUserID}`)
                callback(null, user)

            }
        })
    }
}

module.exports = { // 04
    getUsers,
    findUserBy,
}



/*
01 damit wir mit Userservice auf DB zugriefen können, brauchen wir Usermodel

02 in callbackmethode wird Ergebnis reingeschrieben. Callback methode wird übergeben beim Aufruf

03 find(x()) ist asynchrone function wo callback-methode erwaret wird. diese bekommt ein error-object und users, die wir als ergebnis zurück bekommen so werden bei mongoose immer callbacks ausgeführt: es werden 2 parameter übergeben: Errror-Objekt, falls ein Error Auftritt und das Ergebnis: der querry "users" 

04  exports in Array- Form, damit man später noch mehr Methoden einreihen kann, zum Exportieren

*/
