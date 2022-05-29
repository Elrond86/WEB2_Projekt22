"use strict"

const UserService = require("../user/UserService")
var jwt = require("jsonwebtoken")
var config = require("config")
var logger = require("../../config/winston")


function createSessionToken(props, callback) {
    logger.debug("AuthenticationService: create Token");

    if (!props) {
        logger.debug("Error: have no json body")
        callback("JSON-Body missing", null, null, 400)  
        return
    }
    logger.debug("props:" + props)
    const base64Credentials = props.split(' ')[1]
    logger.debug("base64Credentials: " + base64Credentials)
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii')
    const [username, password] = credentials.split(':')
    logger.debug("username: " + username)
    logger.debug("password: " + password)

    UserService.findUserBy(username, function (error, user) {
        logger.debug(`user: ${user}`)
        if (user) {
            logger.debug("Found user, checking password...")

            user.comparePassword(password, function (err, isMatch) {

                if (err) {
                    logger.debug("err: " + err)
                    callback(err, null, null);
                }
                else if (!isMatch) {
                    logger.error("Password is invalid")
                    logger.error(err)
                    callback(err, null, null, 401);
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

                    callback(null, token, user, 201)
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
