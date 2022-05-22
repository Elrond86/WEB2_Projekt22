var express = require("express"); var router = express.Router();
var authenticationService = require("./AuthenticationService")
var config = require("config")
var logger = require("../../config/winston")

router.post("/login", function (req, res, next) {
    logger.debug("Initiating Token-Generation...")
    console.log(`Initiating Token-Generation for User with userID '${req.body.userID}'...`)

    authenticationService.createSessionToken(req.body, function (err, token, user) {
        if (token) {

            res.header("Authorization", "Bearer" + token)

            if (user) {
                const { id, userID, userName, ...partialObject } = user
                const subset = { id, userID, userName } /* ich hole mir aus user nur id, userID und Namen!!!!!  *01*  */
                console.log(JSON.stringify(subset))  /* ...dann schreib ich nur diese Userdaten hier in den Body und geb es... */
                res.send(subset) /* ...an die response zurück  */
            }
            else {
                console.log("User is null, even though a token has been created. Error: " + err)
                res.send("Could create token")
            }
        }
        else {
            console.log("Token has not been created, Error: " + err)
            res.send("Could not create token")
        }
    })
})

module.exports = router;