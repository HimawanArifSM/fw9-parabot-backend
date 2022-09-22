const order = require('express').Router();
const authMiddleware = require('../middleware/auth');
const orderController = require('../controllers/order');

order.post('/order', authMiddleware, orderController.createOrderPaid);
order.get('/order/:type', authMiddleware, orderController.getAllOrder);
order.get('/order/details/:id', authMiddleware, orderController.getDetailsOrder);
order.patch('/order/:id', authMiddleware, orderController.updateStatusOrder);

module.exports = order;