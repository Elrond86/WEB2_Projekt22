"use strict"

var express = require("express"); var router = express.Router();
var AuthenticationService = require("./AuthenticationService")
var config = require("config")
var logger = require("../../config/winston")


router.get('/', (req, res, next) => {
    logger.debug("Initiating Token-Generation...")
    
    AuthenticationService.createSessionToken(req.headers.authorization, function (err, token, user, statuscode) {
        logger.debug(user) 
        if (token) {

            res.header("Authorization", "Bearer " + token)
            res.status(statuscode)

            if (user) {
                const { id, userID, userName, ...partialObject } = user
                const subset = { id, userID, userName } /* ich hole mir aus user nur id, userID und Namen!!!!!  *01*  */
                logger.debug(JSON.stringify(subset))  /* ...dann schreib ich nur diese Userdaten hier in den Body und geb es... */
                res.send(`Token created for user with body: \n ${JSON.stringify(subset)}`) /* ...an die response zurück  */
            }
            else {
                console.log("User is null, even though a token has been created. Error: " + err)
                res.send("Could create token")
            }
        }
        else {
            logger.error(err)
            console.log("Token has not been created, Error: " + err)
            res.status(statuscode).send(`Could not create token for user ${user}: ${err}`)
        }
    })
})

module.exports = router;