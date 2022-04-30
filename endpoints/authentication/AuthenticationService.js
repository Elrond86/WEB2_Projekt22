var userService = require("../user/UserService")
var jwt = require("jsonwebtoken") 
var config = require("config")
/* const logger = require("nodemon/lib/utils/log"); */


function createSessionToken(props, callback) {
    console.log("AuthenticationService: create Token");

    if (!props) {
        console.log("Error: have no json body")
        callback("JSON-Body missing", null, null)
        return
    }

    userService.findUserBy(props.userID, function (error, user) {

        if (user) {
            console.log("Found user, checking password...")

            user.comparePassword(props.password, function (err, isMatch) {

                if (err) {
                    console.log("Password is invalid")
                    callback(err, null);
                }
                else {
                    console.log("Password is correct. Create token.")

                    var issueAt = new Date().getTime()
                    var expirationTime = config.get("sessionStorage.timeout")
                    var expiresAT = issueAt + (expirationTime * 1000)
                    var privateKey = config.get("session.tokenKey")
                    let token = jwt.sign({ "user": user.userID }, privateKey, { expiresIn: expiresAT, algorithm: "HS256" })

                    console.log("Token created: " + token)

                    callback(null, token, user)
                }
            }
            )              
        }
        else {
            console.log("Session Services: Did not find user for user ID: " + props.userID)
            callback("Did not find user", null);
        }
    })
}

module.exports = {
    createSessionToken
}
