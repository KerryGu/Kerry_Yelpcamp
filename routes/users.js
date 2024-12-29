const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync')
const { storeReturnTo} = require('../middleware')
const users = require('../controllers/users');

router.route('/login')
    .get( (req, res) => { 
    res.render('users/login')})      //By using the storeReturnTo middleware function, we can save the returnTo value to res.locals before passport.authenticate() clears the session and deletes req.session.returnTo.
    .post(
    // use the storeReturnTo middleware to save the returnTo value from session to res.locals
    storeReturnTo,
    // passport.authenticate logs the user in and clears req.session
    passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),   
    // use res.locals.returnTo to redirect the user after login
    users.userLogIn)

router.route('/register')
    .get(users.showRegisterPage)
    .post(catchAsync(users.registerUsers));

router.get('/logout', users.userLogOut); 



module.exports = router;