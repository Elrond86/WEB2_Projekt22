var mongoose = require("mongoose");
const config = require("config");

let _db;

const connectionString = config.get("db.connectionString");
//initDB erwartet eine callback-function mit zwei paramatern, als feedback, ob was schiefging und datenbank angebunden wurde
function initDB(callback) {
    if (_db) {
        if (callback) {
            return callback(null, _db);
        }
        else {
            return _db;
        }
    }
    else {
        mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });  // "useCreateIndex: true" -Option wurde bei einem früheren Update entfernt 
        _db = mongoose.connection;

        _db.on("error", console.error.bind(console, "connection error:"));
        _db.once("open", function () {
            console.log("Connected to database " + connectionString + " in DB.js: " + _db.name + " @ " + _db.host + ":" + _db.port);
            callback(null, _db);
        });
    }
}

function getDB() {
    return _db;
}

function close() {
    // logger.debug("Function still missing. (db.close())");
    _db.close()
    console.log("Database closed");
}

module.exports = { getDB, initDB, close };
