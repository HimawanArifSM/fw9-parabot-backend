const review = require('express').Router();
const reviewController = require('../controllers/review');
const auth = require('../middleware/auth');

review.get('/review',reviewController.getReview);
review.post('/review',auth,reviewController.createReview);

module.exports = review