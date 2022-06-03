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