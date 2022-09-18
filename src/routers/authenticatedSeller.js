const authenticated = require('express').Router();
const authenticatedControl = require('../controllers/authenticated')
const authMiddleware = require('../middleware/auth');
const uploadMiddleware = require('../middleware/upload');
const {body} = require('express-validator');

const emailValidator = [
  body('email').isEmail().withMessage('Email format invalid'),
]

authenticated.get('/profile/seller', authMiddleware, authenticatedControl.getProfileSeller) // get data profile seller
authenticated.patch('/profile/seller', authMiddleware, uploadMiddleware, authenticatedControl.updateProfileSeller) // edit profile seller 
authenticated.patch('/profile/email', authMiddleware, ...emailValidator, authenticatedControl.updateEmail) // edit email seller 
authenticated.get('/myProducts', authMiddleware, authenticatedControl.getAllProductsUser); // get data product seller
authenticated.get('/products/:id', authMiddleware, authenticatedControl.getProductById); // get data product for edit
authenticated.post('/products', authMiddleware, uploadMiddleware, authenticatedControl.createProduct); // create product
authenticated.patch('/products/:id', authMiddleware, authenticatedControl.updateProduct); // update product
authenticated.delete('/products/:id', authMiddleware, authenticatedControl.deleteProduct); // delete product
// update status order proces > sent

module.exports=authenticated