const base64Credentials = req.headers.authorization.split('')[1]
const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii')
const [username, password] = credentials.split
const user = await userService.authenticate({ username, password })
if (!user) {
    return res.status(401).json({ message: 'Invalid Authentication Credentials' });
}



AuthenticationService.createSessionToken(req.headers.authorization, function (err, token, user, statuscode) {
    console.log("req.headers.authorization: " + req.headers.authorization)

     
    if (token) {

        res.header("Authorization", "Bearer " + token)

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