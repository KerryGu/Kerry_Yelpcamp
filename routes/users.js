const User = require('../models/user');
const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync')
const { storeReturnTo} = require('../middleware')


router.get("/login", (req, res) => { 
    res.render('users/login')
})


//By using the storeReturnTo middleware function, we can save the returnTo value to res.locals before passport.authenticate() clears the session and deletes req.session.returnTo.
router.post("/login",
    // use the storeReturnTo middleware to save the returnTo value from session to res.locals
    storeReturnTo,
    // passport.authenticate logs the user in and clears req.session
    passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),   
    // use res.locals.returnTo to redirect the user after login
    (req, res) => {
        req.flash('success', 'welcome back!');
        const redirectUrl = res.locals.returnTo || '/campgrounds'; // store the page to return to or the campground page ( if there is no page to return to )
        console.log(redirectUrl);
    res.redirect(redirectUrl );
})
    
router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', catchAsync(async(req, res, next) => { 
    try {
        const { email, username, password } = req.body
        const user = new User({ email, username, password});
        // register() is from passport validation:initialize a user
        const registeredUser = await User.register(user, password);
        // login the user when the user successfully registers
        req.login(registeredUser, err => { 
            if (err) return next(err);
            req.flash('success', 'Welcome to the Camp!');
            res.redirect('/campgrounds');
    
        })
       
    }
    catch (e) { 
        // when the register info is not valid -> flash error message at top,user won't
        //be redirected to another page
        console.log(e);
        req.flash('eror', e.message);
        res.redirect('/register');
    }  
}))

router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}); 



module.exports = router;