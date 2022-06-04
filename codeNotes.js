/* get all threads verschiedene methoden gehen nicht...*/ 
Route:


router.get("/", async (req, res, next) => {
  logger.debug("Getting all ForumThreads...")
  try {
    const Threads = ForumThreadService.getForumThreads()
    Threads.exec()
    console.log(Threads)
    res.status(200).send(Threads)
  } catch (err){
    res.status(404).send(err)
  }
})


router.get("/",  (req, res, next) => {
  logger.debug("Getting all ForumThreads...")
     ForumThreadService.getForumThreads()
})

router.get("/"), (req, res,next) => {
  query.exec((err, forums)=>{
    if(err) {
        logger.error(err.message)
        return err
    }
    else {
        console.log(forums)
        res.status(200).send(forums)
    }
})  
}


Service:

// funzt
function getForumThreads() {
  logger.debug("Getting all ForumThreads...")
  return new Promise(async (resolve, reject) => {
      const forums = await ForumThread.find({})
      if (forums) {
          resolve(forums)
      }
      else {
          reject([])
      }
  })
}
// funzt

// funzt
function getForumThreads() {
  logger.debug("Getting all ForumThreads...")
  const forums = ForumThread.find({}).exec()
  console.log(forums)  //gibt promise zurück und nicht ergebnis von promise
  return forums  //gibt auch nur promise zurück (vermutlich). aber wird mit await aufgerufen von der Route, also passt
}
// funzt






//------------------- WARUM geht der return hier nicht, obwohl console.log funktioniert??  ---------------------//
async function getForumThreads() {
  logger.debug("Getting all ForumThreads...")
  var forums = await ForumThread.find({})
  console.log(forums)
  console.log("err: " + err)
  logger.debug(err)
  return forums
}
//------------------- WARUM geht der return hier nicht, obwohl console.log funktioniert??  ---------------------//



// funzt auch nicht
function getForumThreads() {
    logger.debug("Getting all ForumThreads...")
    const query = ForumThread.find({})
    query.exec((err, forums)=>{
        if(err) {
            logger.error(err.message)
            return err
        }
        else {
            console.log(forums)
            res.status(200).send(forums)
        }
    })  
}
// funzt auch nicht


















//--------------------------------//


// ForumService:

// create forumThread
function createForumThread(ThreadData, currentuser) {
    let ownerID = currentuser.userID

    if (ownerID == null || ownerID == undefined) {
        return reject("no OwnerID", null)
    }
    return new Promise((resolve, reject) => {
        logger.debug(`creating new ForumThread '${ThreadData.name}'`)
        let Thread = new ForumThread()
        Object.assign(Thread, ThreadData)
        Thread.ownerID = ownerID
        logger.debug(`Thread object assigned with ThreadData with name '${ThreadData.name}'... Saving Thread object in Database...`)
        Thread.save(function (err, Thread) {
            if (err) {
                if (err.code == 1100) {
                    logger.error("Could not create ForumThread: " + err.code)
                    reject(["ForumThread already exists!", 500], null)
                }
                logger.error(err)
                reject(["Could not create ForumThread", 500], null)
            }
            else {
                logger.debug("Forumthread erfolgreich erstellt.")
                console.log("Forumthread erfolgreich erstellt.")
                resolve([null, 201], Thread)
            }
        })

    })
}

// get all forumThreads
/* async function getForumThreads() {
    console.log("forumservice")
    const forums = (await ForumThread.find({}))
    return forums
}; */

/* function getForumThreads() {
    return new Promise((resolve, reject) => {
        const forums = ForumThread.find()
        if (forums) {
            resolve(forums, 200)
        }
        else {
            reject("Did not find anything", 404)
        }
    })
} */

async function getForumThreads() {
    try {
        const forums = await ForumThread.find({})
        return (forums, 200)
    } catch (err) {
        return ("Did not find anything", 404)
    }
}

function getAllThreads() {
    return getForumThreads()
}



// ForumRoute:



//------------------------------------------------------
//------------------------------------------------------





/* get all threads */

// this gets only the first result //
// bei create funktioniert es
/* 
router.get("/", async (req, res, next) => {
  logger.debug("Bin in Forumroute.get")
  try {
    const response = await ForumThreadService.getForumThreads()
    res.send(response[0]).status(response[1])
  } catch (reject){
    res.send(reject[0]).status(reject[1])
  }
})
*/

/** this is wrong module structure --> route gets direct access to DB
 * Es Funktioniert aber! Aber warum wird der Statuscode nicht übertragen?
 * wird auch in den anderern Versionen nicht übertragen.
 * Wie kann ich dieses prinzip mit promise&async nutzen, 
 * wenn ich es in ForumThreadService auslagere?
 */

 router.get("/", async (req, res, next) => {
    logger.debug("Bin in Forumroute.get")
    try{
      const forums = await ForumThread.find({})
      console.log(forums)
      logger.debug("Bin in Forumroute.get TRY")
      res.status("200").res.send(forums)
    }catch{
      logger.error(err)
      res.status("404").res.send(null)
    }    
  })
  
  
  /* router.get("/", async (req, res, next) => {
    logger.debug("Bin in Forumroute.get")
    try {
      const forums = await ForumThreadService.getAllThreads()
      console.log(forums)
      logger.debug("Bin in Forumroute.get TRY")
      res.sendStatus(200).send(forums)
    } catch (err) {
      logger.error(err)
      res.status(404).send(null)
    }
  }) */
  
  
  
  
  //------------------------------------------------------
  //------------------------------------------------------



  //

  AUTh anders

  async function createSessionToken(props, callback) {
    logger.debug("AuthenticationService: create Token");

    if (!props) {
        logger.debug("Error: have no json body")
        callback("JSON-Body missing", null, null, 400)
        return
    }
    logger.debug("props:" + props)
    const base64Credentials = props.split(' ')[1]
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii')
    const [searchUserID, password] = credentials.split(':')
    logger.debug("base64Credentials: " + base64Credentials + ", userID: " + searchUserID + ", password: " + password)
    logger.debug(`searching for User with userID: ${searchUserID}...`)
    try{
        const user = await user.findOne({ userID: searchUserID }).exec()
        logger.debug(forum)
        logger.debug(`user: ${user}`)

        {
            logger.debug("Found user, checking password...")
    
            user.comparePassword(password, function (err, isMatch) {
    
                if (err) {
                    logger.debug("err: " + err)
                    callback(err, null, null);
                }
                else if (!isMatch) {
                    let err = "Password is invalid"
                    logger.error(err)
                    logger.debug(user.userID)
                    callback(err, null, user.userID, 401);
                }
                else {
                    logger.debug("Password is correct. Creating token...")
    
                    var issueAt = new Date().getTime()
                    var expirationTime = config.get("session.timeout")
                    var expiresAT = issueAt + (expirationTime * 1000)
                    var privateKey = config.get("session.tokenKey")
                    let token = jwt.sign({
                        "userID": user.userID,
                        "userName": user.userName,
                        "isAdministrator": user.isAdministrator
                    },
                        privateKey,
                        { expiresIn: expiresAT, algorithm: "HS256" })
    
                    logger.debug("Token created: " + token)
                    console.log("Token created: " + token)
    
                    callback(null, token, user, 201)
                }
            }
            )
        }
        else {
            logger.debug("Session Services: Did not find user for user ID: " + props.userID)
            callback("Did not find user", null, null, 404);
        }

    } catch (err){

    }
}




//----------------

/* get one user */
router.get('/:userID', isAuth, isAdmin, (req, res, next) => {
    UserService.findUserBy(req.params.userID, hideInessentails, 
      function (err, user) {
        if (user) {
          res.send(user)
          logger.debug(user)
        }
        else {
          logger.error(err)
          res.send("Did not find any User with this userID" + [])
        }
      })
  });



  function createSessionToken(props, callback) {
    logger.debug("AuthenticationService: create Token");

    if (!props) {
        logger.debug("Error: have no json body")
        callback("JSON-Body missing", null, null, 400)
        return
    }
    logger.debug("props:" + props)
    const base64Credentials = props.split(' ')[1]
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii')
    const [username, password] = credentials.split(':')
    logger.debug("base64Credentials: " + base64Credentials + ", username: " + username + ", password: " + password)

    findUserBy(username, function (err, user) {
        logger.debug(`user: ${user}`)
        if (user) {
            logger.debug("Found user, checking password...")

            user.comparePassword(password, function (err, isMatch) {

                if (err) {
                    logger.debug("err: " + err)
                    callback(err, null, null);
                }
                else if (!isMatch) {
                    let err = "Password is invalid"
                    logger.error(err)
                    logger.debug(user.userID)
                    callback(err, null, user.userID, 401);
                }
                else {
                    logger.debug("Password is correct. Creating token...")

                    var issueAt = new Date().getTime()
                    var expirationTime = config.get("session.timeout")
                    var expiresAT = issueAt + (expirationTime * 1000)
                    var privateKey = config.get("session.tokenKey")
                    let token = jwt.sign({
                        "userID": user.userID,
                        "userName": user.userName,
                        "isAdministrator": user.isAdministrator
                    },
                        privateKey,
                        { expiresIn: expiresAT, algorithm: "HS256" })

                    logger.debug("Token created: " + token)
                    console.log("Token created: " + token)

                    callback(null, token, user, 201)
                }
            }
            )
        }
        else {
            logger.debug("Session Services: Did not find user for user ID: " + props.userID)
            callback("Did not find user", null, null, 404);
        }
    })
}
