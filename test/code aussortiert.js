
function updateUser(userID, newUserData, callback) {
    logger.debug(`Updating user '${userID}'...`)
    findUserBy(userID, function (err, user) { //UserService>updateUser>findUserBy() callback
        if (user) {
            logger.debug(user)
                (null, user.body)
        }
        else {
            logger.error(err)
            return console.log("Did not find any User with this userID" + [], null)
        }
    })
    //logger.debug("user:" + user, err)
    console.log("so far so good...")
    let id = user.body.id
    let user = new User()
    Object.assign(user, user.body)
    Object.assign(user, newUserData)
    user.body.id = id
    user.save(function (err) {
        if (err) {
            logger.debug("Could not create user account: " + err)
            return callback("Could not create user account", null)
        }
        else {
            callback(null, user)
        }
    })
}





function updateUser(userID, newUserData, callback) {
    logger.debug(`Updating user '${userID}'...`)
    findUserBy(userID, function (err, user) { //UserService>updateUser>findUserBy() callback
        if (user) {
            logger.debug(user)
                (null, user.body)
        }
        else {
            logger.error(err)
            return console.log("Did not find any User with this userID" + [], null)
        }
    })
    //logger.debug("user:" + user, err)
    console.log("so far so good...")
    let id = user.body.id
    let user = new User()
    Object.assign(user, user.body)
    Object.assign(user, newUserData)
    user.body.id = id
    user.save(function (err) {
        if (err) {
            logger.debug("Could not create user account: " + err)
            return callback("Could not create user account", null)
        }
        else {
            callback(null, user)
        }
    })
}


function createUser(searchUserID, req, callback) {
    logger.debug("bin in findUsers")
    logger.debug("UserService: find User by ID: " + searchUserID)
    var query = User.findOne({ userID: searchUserID }) // query object erstellen
    query.exec(function (err, user) { //query wird asynchron ausgeführt
        if (err) {
            logger.debug("Did not find user for userID: " + searchUserID)
            return callback("Did not find user for userID: " + searchUserID, null)  // callback übergibt fehlernachricht
        }
        else {
            if (user) {
                logger.debug(`Found user with userID: ${searchUserID}`)
                  console.log(`Updating ${user.userID} it with new Data...`)
                  var newUser = new User()
                  newUser.ID = user.id
                  newUser.userID = req.body.userID
                  newUser.password = req.body.password
                  newUser.userName = req.body.userName
                  newUser.isAdministrator = true

                  newUser.save(function (err) {
                      if (err) {
                          logger.debug("Could not create default admin account: " + err)
                          callback("Could not login to admin account", null)
                      }
                      else {
                          callback(null, adminUser)
                      }
                  })
              
                callback(null, user)
            }
            else {
                logger.debug("Could not find user for userID: " + searchUserID)
                callback(null, user)  // das kommt dann zurück und wird da zurckgegeben als function-return: userService.findUserBy(props.userID, function (error, user)

            }
        }
    })

}



router.put('/:userID',
    function (req, res, next) {
        userService.updateUser(req.params.userID, req, function (err, user) {
            if (user) { logger.debug(user); res.send(`User ${req.body.userID} sucessfully updated. \r\r new Json-Body: \r ` + user) }
            else { logger.error(err); res.send("Did not find any User with this userID" + []) }
        })
    })

/* router.put('/:userID', function (req, res, next) {
    userService.updateUser(req.params.userID, req, function (err, user) {
        if (user) {
            //res.send(Object.assign(user))
            logger.debug(user)
            res.send(`User ${req.body.userID} sucessfully updated. \r\r new Json-Body: \r ` + user)
        }
        else {
            logger.error(err)
            res.send("Did not find any User with this userID" + [])
        }
    })
})
 */



/* für Update (id darf nicht geändert werden) */
// update User

function updateUserById(userID, body, callback) {
    User.findOne({ "userID": userID }, (err, user) => {
        if (user) {
            Object.assign(user, body);
            user.save((err) => {
                if (err) {
                    callback(err, null, 500);
                } else {
                    const { userID, userName, isAdministrator, password, email, createdAt, updatedAt, ...partialObject } = user;
                    const subset = { userID, userName, isAdministrator, password, email, createdAt, updatedAt };
                    callback(null, subset, 200);
                }
            });
        } else {
            callback(`No user with ID ${userID} found`, null, 404);
        }
    });
};

