
module.exports.isLoggedIn = (req, res, next) => {
    //req.user : passport autimatically deserialize and take out the user from the session 
    ondeviceorientationabsolute.log("REQ.USER...", req.user);
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}