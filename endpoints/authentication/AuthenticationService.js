var userService = require('../user/UserService')

function createSessionToken(props, callback){
    console.log("AuthenticationService: create Token");

    if(!props)
    {
        console.log("Error: have no json body")
        callback("JSON-Body missing", null, null)
        return
    }

    userService.findUserBy(props.userID, function(errir, user){
        
    })
}