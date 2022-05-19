var userService = require("../user/UserService")
var jwt = require("jsonwebtoken")
var config = require("config")
var logger = require("../../config/winston")


function createSessionToken(props, callback) {
    logger.debug("AuthenticationService: create Token");

    if (!props) {
        //logger.debug("Error: have no json body")
        logger.debug("Error: have no json body")
        callback("JSON-Body missing", null, null)
        return
    }

    userService.findUserBy(props.userID, function (error, user) {
        if (user) {
            logger.debug("Found user, checking password...")

            user.comparePassword(props.password, function (err, isMatch) {

                if (err) {
                    logger.debug("err: " + err)
                    callback(err, null);
                }
                else if (!isMatch) {
                    logger.error("Password is invalid")
                    callback(err, null);
                }
                else {
                    logger.debug("Password is correct. Creating token...")

                    var issueAt = new Date().getTime()
                    var expirationTime = config.get("session.timeout")
                    var expiresAT = issueAt + (expirationTime * 1000)
                    var privateKey = config.get("session.tokenKey")
                    let token = jwt.sign({ "user": user.userID }, privateKey, { expiresIn: expiresAT, algorithm: "HS256" })

                    logger.debug("Token created: " + token)
                    console.log("Token created: " + token)

                    callback(null, token, user)
                }
            }
            )
        }
        else {
            logger.debug("Session Services: Did not find user for user ID: " + props.userID)
            callback("Did not find user", null);
        }
    })
}

module.exports = {
    createSessionToken
}
