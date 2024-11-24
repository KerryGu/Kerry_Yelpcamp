const User = require('../models/user');
const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync')


router.get("/login", (req, res) => { 
    res.render('users/login')
})

router.post("/login", passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'welcome back!');
    res.redirect('/campgrounds');
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