const passport = require('passport');

// Google Auth consent screen route
const googleAuth = passport.authenticate('google', {
    scope: ['email', 'profile']
});

// Call back route
const googleCallback = passport.authenticate('google', {
    failureRedirect: '/failed'
}, (req, res) => {
    res.redirect('/success');
});

// Logout route
const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log('Error while destroying session:', err);
        } else {
            req.logout(() => {
                console.log('You are logged out');
                res.redirect('/home');
            });
        }
    });
};


module.exports = {
    googleAuth,
    googleCallback,
    logout
}