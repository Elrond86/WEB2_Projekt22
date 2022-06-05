UserSchema.pre("save", function (next) {

   
    if (!user.isModified("password")) { return next() };
    bcrypt.hash(user.password, 10).then((hashedPassword) => { //hier wird das passwort bereits MIT salt gehasht. die stärke des SALTS ist 10. der SALT wird auf diese Weise aber NICHT zusätzlich vor den hashwert angehängt...oder doch? (sehr kurz)
        user.password = hashedPassword;
        next();
    })
}, function (err) {
    next(err)
})



ForumMessageSchema.pre("save", function (next) {

    this.parentThread = this.get("forumThreadID");

    User.findOne({ userID: authorID }).then((poppedUpUser) => {
        this.author = this.get(poppedUpUser._id);
        next();
    })
    
},function (err) {
    next(err)
})