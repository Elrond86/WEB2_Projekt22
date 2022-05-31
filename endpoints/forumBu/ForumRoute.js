const express = require('express')
const router = express.Router()
const forumService = require('./ForumService')
const authenticationService = require('../authentication/AuthenticationService')
const {isAuthenticated, isAdmin, isForumOwner} = require("../authentication/isAuthenticated");
var jwt = require("jsonwebtoken")
var config = require("config")

router.use(express.json())

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

router.put("/:forumThreadID", isForumOwner, (request, response) => {

    const forumThreadID = request.params.forumThreadID

    const forumData = {
        forumName: request.body.name,
        forumDescription: request.body.description,
        _id: forumThreadID
    }

    forumService.updateForumData(forumData, (error, updatedForum) => {
        if (error) {
            response.send(error)
        } else {
            response.send(updatedForum)
        }
    })
})

router.delete("/:forumThreadID", isForumOwner, (request, response) => {

    const forumThreadID = request.params.forumThreadID

    forumService.deleteForum(forumThreadID, (error, forum) => {
        if (error) {
            response.send(error)
        } else {
            if (!forum) {
                response.status(404);
            } else {
                response.json(forum)
            }
        }
    })
})

router.get("/getByOwnerID", isAdmin, (request, response) => {
    const user = request.body
    if (user) {
        const ownerID = user.ownerID || "admin"
        forumService.getAllForumsOfUser(ownerID, (error, forums) => {
            if (error) {
                response.send(error)
            } else {
                response.send(forums)
            }
        })
    } else {
        response.status(500);
    }

    
})

router.get("/:forumThreadID", (request, response) => {
    console.log("get forum thread with id", request.params.forumThreadID)
    const forumThreadID = request.params.forumThreadID
    
    if (forumThreadID === 'myForumThreads') {
        const token = request.headers.authorization.split(" ")[1]

        console.log("-- GET /forum/myForumThreads --")
        
        var privateKey = config.get('session.tokenKey');
        jwt.verify(token, privateKey, { algorithm: "HS256" }, (err, user) => {
            const userID = user.user

            // get all forum threads of user
            forumService.getAllForumsOfUser(userID, (error, forums) => {
                if (error) {
                    response.send(error)
                } else {
                    response.send(forums)
                }
            })
        })
        return;
    }
    
    forumService.findForumById(forumThreadID, (error, forumThread) => {
        if (error || !forumThread) {
            response.status(404).json({error: error})
        }
        else {
            response.send(forumThread)
        }
    }
    )
})

module.exports = router