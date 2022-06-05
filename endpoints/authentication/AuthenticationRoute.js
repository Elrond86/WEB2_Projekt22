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
                const { userID, userName, isAdministrator, ...partialObject } = user
                const subset = { userID, userName, isAdministrator } 
                logger.debug(JSON.stringify(subset))  
                res.json({Success: "Token created successfully"}) 
            }
            else {
                console.log("User is null, even though a token has been created. Error:" + err)
                res.json({Message: "User is null, even though a token has been created."})
            }
        }
        else {
            logger.error(err)
            console.log("Token has not been created, Error: " + err)
            res.status(statuscode).json({Message: `Could not create token for user ${user}: ${err}`})
        }
    })
})

module.exports = router;