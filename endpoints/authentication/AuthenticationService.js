"use strict"

const {findUserBy} = require("../user/UserService")
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
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii')
    const [username, password] = credentials.split(':')
    logger.debug("base64Credentials: " + base64Credentials + ", username: " + username + ", password: " + password)

    findUserBy(username, true, function (err, user) {
        logger.debug(`user: ${user}`)
        if (user) {
            logger.debug("Found user, checking password...")

            user.comparePassword(password, function (err, isMatch) {

                if (err) {
                    logger.debug("err: " + err)
                    callback(err, null, null);
                }
                else if (!isMatch) {
                    let err = "Password is invalid"
                    logger.error(err)
                    logger.debug(user.userID)
                    callback(err, null, user.userID, 401);
                }
                else {
                    logger.debug("Password is correct. Creating token...")

                    var issueAt = new Date().getTime()
                    var expirationTime = config.get("session.timeout")
                    var expiresAT = issueAt + (expirationTime * 1000)
                    var privateKey = config.get("session.tokenKey")
                    let token = jwt.sign({
                        "userID": user.userID,
                        "userName": user.userName,
                        "isAdministrator": user.isAdministrator
                    },
                        privateKey,
                        { expiresIn: expiresAT, algorithm: "HS256" })

                    logger.debug("Token created: " + token)
                    console.log("Token created: " + token)

                    callback(null, token, user, 201)
                }
            }
            )
        }
        else {
            logger.debug("Session Services: Did not find user for user ID: " + props.userID)
            callback("Did not find user", null, null, 404);
        }
    })
}

function isAuth(req, res, next) {
    if (typeof req.headers.authorization !== "undefined") {
        let token = req.headers.authorization.split(" ")[1];
        var privateKey = config.get('session.tokenKey');
        jwt.verify(token, privateKey, { algorithm: "HS256" }, (err, user) => {
            if (err) {
                res.status(401).json({ error: "Not Authenticated" });
                return;
            }
            req.user = user;
            return [req.user, next()];
        });
    } else {
        res.status(401).json({ error: "Not Authenticated" });
        return;
    }
}

function isAdmin(req, res, next) {
    const admin = req.user.isAdministrator
    console.log(`${req.user.userID}.isAdministrator: ` + admin)
    if(admin){
        next();
    } else {
        res.status(403).json({ error: `User ${req.user.userID} is not authorized for this action.` });
    }
  }


module.exports = {
    createSessionToken,
    isAuth,
    isAdmin,
}
