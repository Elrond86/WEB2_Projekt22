"use strict"

const fs = require("fs"),
    https = require("https"),
    path = require("path");

const express = require("express");

const certificate = fs.readFileSync(path.join(__dirname, "certificates", "certificate.pem"), "utf8"),
    privateKey = fs.readFileSync(path.join(__dirname, "certificates", "privatekey.pem"), "utf8");


const app = express();

app.get("/", (req, res) => {
         res.send("Hallo aus express über HTTPS");
 
});


const server = https.createServer({
    cert: certificate,
    key: privateKey
}, app);

server.listen(3000);    