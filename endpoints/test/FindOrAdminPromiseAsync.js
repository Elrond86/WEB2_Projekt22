function findAdminUser() {
    return new Promise((resolve, reject) => {
        console.log("Looking for an Administrator")
        let defaultAdmin = User.findOne({ isAdministrator: true })
        logger.debug(defaultAdmin)
        if (defaultAdmin) {
            resolve("Admin found")
        } else {
            reject("Could not find any admin-user")
        }
    })
}

function makeDefaultAdmin() {
    console.log("Do not have admin account yet. Creating it with default password...")
    var adminUser = new User()
    adminUser.ID = ""
    adminUser.userID = "admin"
    adminUser.password = "123"
    adminUser.userName = "Default Administrator Account"
    adminUser.isAdministrator = true

    adminUser.save(function (err) {
        if (err) {
            logger.debug("Could not create default admin account: " + err)
            callback("Could not login to admin account", null)
        }
        else {
            callback(null, adminUser)
        }
    })
}

async function findOrMakeAdmin(){
    try {
        const response = await findAdminUser()
        console.log(response)
    } catch (err) {
        console.log(err)
    }    
}




/* (async function ensureAdminExistence(){
    try {
        const response = await User.findOne(({ isAdministrator: true }))
    } catch (err) {
        console.log(err)
    }
})();
 */



module.exports = processAdminExistence