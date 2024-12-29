
const User = require('../models/user');

module.exports.registerUsers = async (req, res, next) => { 
    try {
        const { email, username, password } = req.body
        const user = new User({ email, username});
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
}

module.exports.showRegisterPage = (req, res) => {
    res.render('users/register');
}

module.exports.userLogOut = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}

module.exports.userLogIn = (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = res.locals.returnTo || '/campgrounds'; // store the page to return to or the campground page ( if there is no page to return to )
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}