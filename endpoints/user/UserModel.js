var mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({

    userID: { type: String, require: true, unique: true },
    userName: { type: String, default: "Wayne" },
    isAdministrator: { type: Boolean, default: false },
    password: { type: String, default: "123" },
    email: { type: String},
    createdAt: { type: Date, immutable: true, default: () => Date.now() },
    updatedAt: { type: Date, default: () => Date.now() }
}, { timestamps: true }
);

UserSchema.methods.whoAmI = function () {
    var output = this.userID
        ? "My name is " + this.userName
        : "I don't have a name";
    console.log(output);
}

UserSchema.pre("save", function (next) {

    var user = this;

    //logger.debug("Pre-save: " + this.password + " change: " + this.isModified("password"));

    if (!user.isModified("password")) { return next() };
    bcrypt.hash(user.password, 10).then((hashedPassword) => { //hier wird das passwort bereits MIT salt gehasht. die stärke des SALTS ist 10. der SALT wird auf diese Weise aber NICHT zusätzlich vor den hashwert angehängt...oder doch? (sehr kurz)
        user.password = hashedPassword;
        next();
    })
}, function (err) {
    next(err)
})

UserSchema.methods.comparePassword = function (candidatePassword, next) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err)
            return next(err)
        else
            next(null, isMatch)
    })
}

const User = mongoose.model("User", UserSchema)

module.exports = User