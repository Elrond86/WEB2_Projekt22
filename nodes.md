#run this command to generat express project

npx express-generator htpps_server

#to install node.js libraries

#create folder

mkdir certificates

#Creating the SSL Certificate

sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout server.key -out server.crt

#open bin/www to change the from http to https var https = require('https'); var fs = require("fs");

const httpsOptions = { //path to key key: fs.readFileSync("/home/ninjaroot/htpps_server/certificates/server.key"), //path to crt cert: fs.readFileSync("/home/ninjaroot/htpps_server/certificates/server.crt") }

var server = https.createServer(httpsOptions,(app) )