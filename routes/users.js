const User = require('../models/user');
const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
router.get('/register', (req, res) => {
    res.render('users/register');
});

router.get("/login", (req, res) => { 
    res.render('users/login')
})
    
router.post('/register', catchAsync(async(req, res) => { 
    try {
        const { email, username, password } = req.body
        const user = new User({ email, username });
        // register() is from passport validation:initialize a user
        const registeredUser = await User.register(User, Password);
        req.flash('success', 'Welcome to the Camp!');
        res.redirect('/campgrounds');
    
    }
    catch (e) { 
        // when the register info is not valid -> flash error message at top,user won't
        //be redirected to another page
        req.flash('eror', e.message);
        res.redirect('/register');
    }  
}))



module.exports = router;