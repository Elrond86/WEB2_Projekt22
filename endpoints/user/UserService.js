const User = require("./Usermodel")  // 01


function getUsers(callback) /* 02 */ {
    // console.log("bin in getUsers")
    User.find(function (err, users) /* 01 */ {
        if (err) {
            console.log("Error while searching; " + err)
            return callback(err, null)  // Fehler wird zurückgegeben, user = null, also nicht zurück
        }
        else {
            console.log("All fine")
            return callback(null, users)  //err = null also kein Fehler zurück geben, sondern users
        }
    })
}

function findUserBy(searchUserID, callback) {
    // console.log("bin in findUsers")
    console.log("UserService: find User by ID: " + searchUserID)

    if (!searchUserID) {
        callback("UserID is missing")
        return
    }
    else {
        var query = User.findOne({ userID: searchUserID }) // query object erstellen
        query.exec(function (err, user) { //query wird asynchron ausgeführt
            if (err) {
                console.log("Did not find user for userID: " + searchUserID)
                return callback("Did not find user for userID: " + searchUserID, null)  // callback übergibt fehlernachricht
            }
            else {
                if (user) {
                    console.log(`Found userID: ${searchUserID}`)
                    callback(null, user)
                }
                else {
                    if ("admin" == searchUserID) {  //kommt nur, wenn ich mich als "admin" einloggen will und es diesen user nicht gibt.
                        console.log("Do not have admin account yet. Creating it with default password...")
                        var adminUser = new User()
                        adminUser.userID = "admin"
                        adminUser.password = "123"
                        adminUser.userName = "Default Administrator Account"
                        adminUser.isAdministrator = true

                        adminUser.save(function (err) {
                            if (err) {
                                console.log("Could not create default admin account: " + err)
                                callback("Could not login to admin account", null)
                            }
                            else {
                                callback(null, adminUser)
                            }
                        })
                    }
                    else {
                        console.log("Could not find user for userID: " + searchUserID)
                        callback(null, user)  // das kommt dann zurück und wird da zurckgegeben als function-return: userService.findUserBy(props.userID, function (error, user)
                    }
                }
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
