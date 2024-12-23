const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync.js');
const Campground = require('../models/campground.js');
const { isLoggedIn, validateCampground, isAuthor} = require('../middleware');
const campgrounds = require('../controllers/campgrounds')
var multer = require('multer')

const { storage } = require('../cloudinary'); // not specifying files, then load the index
const upload = multer({
    storage: storage}) // multer tell storage to store the files in storage (cloudinary)


//Another way to structure
//router.get('/', catchAsync(campgrounds.index));
//router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground))
router.route('/')
    .post(isLoggedIn, upload.array("campground[image]"), validateCampground, catchAsync(campgrounds.createCampground))
    // upload.array('image') 上传多张图， upload.single('image) middleware 上传1张图 
    .get(catchAsync(campgrounds.index));

 
//put before show route, other wise new would be considered as an id
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    
    //validateCampground : 是Joi 的schema
    .put(isLoggedIn, isAuthor, upload.array("image"), validateCampground, catchAsync(campgrounds.updateCampground))
    //update campground
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));


router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))




module.exports = router;