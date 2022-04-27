const User = require("./Usermodel");  // 01

function getUsers(callback) { //02
    User.find(function (err, users) /* 01 */ {
        if (err) {
            console.log("Error while searching; " + err);
            return callback(err, null);  // Fehler wird zurückgegeben, user = null, also nicht zurück
        }
        else {
            console.log("All fine");
            return callback(null, users);  //err = null also kein Fehler zurück geben, sondern users
        }
    })
}

module.exports = { // 04
    getUsers
}



/*
01 damit wir mit Userservice auf DB zugriefen können, brauchen wir Usermodel

02 in callbackmethode wird Ergebnis reingeschrieben. Callback methode wird übergeben beim Aufruf

03 find(x()) ist asynchrone function wo callback-methode erwaret wird. diese bekommt ein error-object und users, die wir als ergebnis zurück bekommen so werden bei mongoose immer callbacks ausgeführt: es werden 2 parameter übergeben: Errror-Objekt, falls ein Error Auftritt und das Ergebnis: der querry 'users' 

04  exports in Array- Form, damit man später noch mehr Methoden einreihen kann, zum exportieren

*/