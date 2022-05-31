router.post("/", isAuthenticated, (request, response) => {
    console.log(request.body) 
    
    const token = request.headers.authorization.split(" ")[1]

    var privateKey = config.get('session.tokenKey');
    jwt.verify(token, privateKey, { algorithm: "HS256" }, (err, user) => {
        const userID = user.user

        const forumData = {
            forumName: request.body.name,
            forumDescription: request.body.description,
            ownerID: userID || "admin"
        }
    
        forumService.addForum(forumData, (error, forum) => {
            if (error) {
                response.send(error)
            } else {
                response.send(forum)
            }
        })
    })
})




router.get("/", (request, response) => {
    console.log("-- GET /forum --")

    // get ownerID from query
    const ownerID = request.query.ownerID

    console.log("ownerID: " + ownerID)

    if (ownerID) {
        forumService.getAllForumsOfUser(ownerID, (error, forums) => {
            if (error) {
                response.send(error)
            } else {
                response.send(forums)
            }
        })
        return;
    }

    forumService.getAllForums((error, forums) => {
        if (error) {
            response.status(404).send(error)
        } else {
            response.send(forums)
        }
    })
})