var express = require("express");
var router = express.Router();


/* Wir wollen alle User zurückgeben */

var userService = require("./UserService")

router.get("/", function(req, res, next){        // req ist http-Request-object und wird von Express übergeben,res ist http-response object (kommt auch von Express) ,next geht zur nächsten Router in der pipeline
    console.log("Bin in user route")
    userService.getUsers(function(err, result){
        console.log("Result (von UserService, seinerseits aufgerufen von UserRoute): " + result)
        if(result)
        {
            res.send(Object.values(result))  //wenn result Objekt nicht NULL ist, in ein Array-Objekt überführen  anders gesagt : "result kommt zurück"
        }
        else {
            res.send("There were issues")  //Wenn Error
        }
    })
console.log("Everything working fine in user route")
}
)

module.exports = router