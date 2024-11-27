const express = require('express');
const router = express.Router({ mergeParams: true });

const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const review = require('../controllers/reviews')

router.post('/', isLoggedIn, validateReview, catchAsync(review.createReview));


//need campground id, need to 1. delete review in the campground, 2. delete the review
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(review.deleteReview));

module.exports = router;