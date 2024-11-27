const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync.js');
const Campground = require('../models/campground.js');
const { isLoggedIn, validateCampground, isAuthor} = require('../middleware');
const campgrounds = require('../controllers/campgrounds')

//Another way to structure
//router.get('/', catchAsync(campgrounds.index));
//router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground))
router.route('/')
    .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground))
    .get(catchAsync(campgrounds.index));

 
//put before show route, other wise new would be considered as an id
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))
    //update campground
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));


router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.enderEditForm))




module.exports = router;