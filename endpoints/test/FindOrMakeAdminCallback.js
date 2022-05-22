//find User by AdminStatus
function findAdmin(callback) {
    logger.debug(`UserService: searching for user with Admin-Status`)
    const query = User.findOne({ isAdministrator: true })
    query.exec(function (err, user) {
        if (err) {
            logger.error(err.message)
            return callback(err.message)
        }
        if (user) {
            logger.debug(`Found userID: ${user.userID}`)
            callback(null, user)
        }
        else {
            logger.error("Did not find user with Admin-Status")
            callback("Did not find user  with Admin-Status")
        };
    })
}

function defaultAdmin(){
    findAdmin(function(err, adminAvailable) {
        if(!err && !user) {
            var adminUser = new User();
            adminUser.userID = "admin"
            adminUser.password = "123"
            adminUser.userName = "Default Administrator Account"
            adminUser.isAdministrator = true

            adminUser.save(function (err) {
                if (err) {
                    console.log("Could not create default admin account: " + err);
                }
            })
        }
    })
}