const cart = require('express').Router();
const authMiddleware = require('../middleware/auth');
const cartController = require('../controllers/cart');

cart.get('/cart-all', authMiddleware, cartController.getAllCartUser);
cart.get('/cartUser/:idProduct', authMiddleware, cartController.getCartUserAndProduct);
cart.post('/cart', authMiddleware, cartController.createCart);
cart.patch('/cart/:id', authMiddleware, cartController.updateCartUser);
cart.patch('/cart/:id/quantity/:idProduct', authMiddleware, cartController.updateQuantityCart);
cart.delete('/cart/:id', authMiddleware, cartController.deleteCartUser);
// cart.patch('/cart', authMiddleware, cartController.updateCart);
// cart.post('/create-order', authMiddleware, cartController.createOrder);
// cart.get('/cart', authMiddleware, cartController.getCartUser);

module.exports = cart;