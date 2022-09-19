const product = require('express').Router();
const authMiddleware = require('../middleware/auth');
const productController = require('../controllers/product');
const uploudMiddleware = require('../middleware/upload');

product.get('/products/details/:id',productController.getProductById);
product.get('/products', productController.getAllProduct);
product.get('/myProducts', authMiddleware, productController.getAllProductsUser);
product.get('/products/:id', authMiddleware, productController.getProductById);
product.post('/products', authMiddleware, uploudMiddleware, productController.createProduct);
product.patch('/products/:id', authMiddleware, productController.updateProduct);
product.delete('/products/:id', authMiddleware, productController.deleteProduct);

// get all product
product.get('/products-all', productController.getProducts)
product.get('/products-category', productController.getProductCategoryCount)

module.exports = product;