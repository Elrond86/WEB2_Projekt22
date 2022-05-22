const run = require("nodemon/lib/monitor/run");
const User = require("../user/UserModel");

findAdmin()
async function findAdmin() {
    try {
        const user = await User.findOne({ isAdministrator: true })
    } catch (err) {
        console.log(err.message)
    }
}

