const order = require('express').Router();
const authMiddleware = require('../middleware/auth');
const orderController = require('../controllers/order');

order.post('/order', authMiddleware, orderController.createOrderPaid);
order.get('/order', authMiddleware, orderController.getAllOrder);

module.exports = order;