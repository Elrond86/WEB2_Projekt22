var express = require("express"); var router = express.Router();
var authenticationService = require("./AuthenticationService")
var config = require("config")
var logger = require("../../config/winston")

router.post("/", function (req, res, next) {
    logger.debug("Processing UserData...")
    console.log(`Processing UserData... for User with userID '${req.body.userID}'...`)

    authenticationService.createSessionToken(req.body, function (err, token, user) {
        function findUserBy(searchUserID, callback) {
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
        }
    })

    module.exports = router;


/* *01*  es wird nich das gesammte SUerobjekt zurück geschickt, nur subset. Es soll nämlich NICHT das gehashte passwort mit rausgegeben wird...will man nicht! */