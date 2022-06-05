const mongoose = require("mongoose")
mongoose.connect("mongodb://localhost/testtestDB")
const forumMessage = require("../../endpoints/forumMessage/ForumMessageModel")



/* async function run() {
    try {
        const message = await forumMessage.create({
            title : "Mambo",
            text: "n4"
        })
        console.log(message)
    }catch (e){
        console.log(e.message)
    }
} */


run()
async function run() {
    try {
        //const message = await forumMessage.where('title').equals('Mambo').limit(1)
        const message = await forumMessage.where("title")
        .equals("Mambo")
        //.populate("responseTo")
        .limit("1")
        .select("title")
        .select("text")
        console.log(message.select("title"))
    }catch (e){
        console.log(e.message)
    }
}
