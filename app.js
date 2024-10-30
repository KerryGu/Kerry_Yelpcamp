const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate'); //boilerplate 相关（app.engine 相关)
const ExpressError = require("./utils/catchAsync.js");
const User = require("./models/user")
const campgroundRoutes = require('./routes/campgrounds.js');
const reviewsRoutes = require("./routes/reviews.js");
const usersRoutes = require('./routes/users.js');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const Joi = require('joi');



mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp'
)

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.engine('ejs', ejsMate)
app.use(express.static(path.join(__dirname, "public")));

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, "views"))

app.use(express.urlencoded({ extended: true })); // parse the request body 
app.use(methodOverride('_method'))
app.use(express.static('public'));
const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: { // specify options for cookies to send back
        httpOnly: true, // security purpose
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // expiration date of the cookie
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash('success'); // redirect 前被存到locals success attribute 的  flash message
    res.locals.error = req.flash('error');
    // set up flash attribute for every input 
    next();
})
app.get('/fakeUser', async (req, res) => {
    const user = new User({ email: "kerrygu@gmail.jijijoij", username: "kerrii" });
    const newUser = await User.register(user, "abcdesf");
    res.send(newUser);
})

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewsRoutes);
app.use('/', usersRoutes);

app.get("/", (req, res) => { res.render('home') })



app.all(/(.*)/, (req, res, next) => {
    next(new ExpressError("Page Not Found", 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render("error", { err });
})


app.listen(3000, () => console.log("serving on port 3000"))

