const payment = require('express').Router();
const paymentController = require('../controllers/payment');
const uploudMiddleware = require('../middleware/upload');
const authMiddleware = require('../middleware/auth');

payment.get('/payment', authMiddleware, uploudMiddleware, paymentController.getAllPayment);
payment.post('/payment', authMiddleware, uploudMiddleware, paymentController.createPayment);

module.exports = payment;