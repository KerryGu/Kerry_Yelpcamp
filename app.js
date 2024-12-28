
// if in production / development mode, take the variables in .env file and stroe the variables in dotenv.process (eg. process.env.SECRET)
if (process.env.NODE_ENV != "production") { 
    require('dotenv').config();
}

const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate'); //boilerplate 相关（app.engine 相关)
const ExpressError = require('./utils/ExpressError');
const User = require("./models/user")
const campgroundRoutes = require('./routes/campgrounds.js');
const reviewsRoutes = require("./routes/reviews.js");
const usersRoutes = require('./routes/users.js');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const Joi = require('joi');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp'
)

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.engine('ejs', ejsMate)
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet({contentSecurityPolicy: false}));
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, "views"))
app.use(mongoSanitize({
    replaceWith: '_',
  }));

app.use(express.urlencoded({ extended: true })); // parse the request body 
app.use(methodOverride('_method'))
app.use(express.static('public'));
const sessionConfig = {
    //not using default name , so harder for hackers to figure out
    name :"settion",
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

// what sources are allowed. what sources can pass the helmet (content security policy), restrict the location we can fetch our resources from 
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/"
    
    
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/"
];
const connectSrcUrls = [
     "https://api.maptiler.com/"
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/df6sihvhh/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
                "https://api.maptiler.com/"
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user; // so in all template I should be able to use currentUser
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

app.get("/home", (req, res) => { res.render('home') })


app.all(/(.*)/, (req, res, next) => {
    next(new ExpressError("Page Not Found", 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render("error", { err });
})


app.listen(3000, () => console.log("serving on port 3000"))

