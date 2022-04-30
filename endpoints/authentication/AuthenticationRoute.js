var express = require("express"); var router = express.Router();
var authenticationService = require("./AuthenticationService")

router.post("/login", function (req, res, next) {
console.log("bin in AuthenticationRoute->router.post")
console.log("req: " + typeof(req))
console.log("res: " +res.body)
    console.log("Want to create token")

    authenticationService.createSessionToken(req.body, function (err, token, user) {
        console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<bin in authenticationRoute->authenticationService.createSessionToken")
        if (token) {

            res.header("Authorization", "Bearer" + token)

            if (user) { /* wenn user != null */
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


/* *01*  es wird nich das gesammte SUerobjekt zurück geschickt, nur subset. Es soll nämlich NICHT das gehashte passwort mit rausgegeben wird...will man nicht! */