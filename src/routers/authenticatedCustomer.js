const authenticatedCustomer = require('express').Router();
const authenticatedControl = require('../controllers/authenticated')
const authMiddleware = require('../middleware/auth');

authenticatedCustomer.get('/profile/customer',authMiddleware,authenticatedControl.getProfileSeller)// get data costumer
authenticatedCustomer.patch('/profile/customer',authMiddleware,authenticatedControl.updateProfileSeller)// edit profile & email
authenticatedCustomer.patch('/profile/customer/email',authMiddleware,authenticatedControl.updateEmail)// update email
// add to wishlist
// add to favorit
// delete cart by id
// checkout 'order payment'
// get all order

module.exports=authenticatedCustomer