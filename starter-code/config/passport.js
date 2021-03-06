const passport = require("passport");
const User = require("../models/User");
const googleStrategy = require("passport-google-oauth20").Strategy

passport.use(User.createStrategy())

passport.use(new googleStrategy({
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: "/auth/google/callback"
},
 async (_, __, profile, done) => {
    const user = User.findOne({googleID: profile.id})
    if (user) {
        return done(null, user)
    }
    const newUser = await User.create({
        name: profile.displayName,
        email: profile._json.email,
        googleID: profile.id,
    })
    done(null, newUser)
    }
))

passport.serializeUser(function(user, done) {
    done(null, user.id)
})

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    })
})


module.exports = passport