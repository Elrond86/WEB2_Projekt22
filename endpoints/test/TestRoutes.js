const express = require("express");

const router = express.Router();  //hier holen wir uns den Router, wo wir dann mehrere requests ran hängen können



router.get("/", function( req, res) {
    res.send("Hello World!")
})


router.get("/json", function (req, res) {
    res.json({name: "JSON Hallo"})
}
)


module.exports = router;  //Testroute exportieren sonst: "TypeError: Router.use() requires a middleware function but got an Object"
