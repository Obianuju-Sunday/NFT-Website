
require('dotenv').config()
const passport =require("passport")

const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/google/callback'
    // callbackURL: '/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
    // Handle user data (e.g., save user to database)
    return done(null, profile);
}));

passport.serializeUser(function(user, done) {
    done(null, user);
    });
    
    passport.deserializeUser(function(user, done) {
    done(null, user);
    });

