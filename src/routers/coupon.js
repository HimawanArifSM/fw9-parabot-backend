const coupon = require('express').Router();
const couponController = require('../controllers/coupon');
const { coupons } = require('../helpers/prisma');
const authMiddleware = require('../middleware/auth');

coupon.get('/coupon/:code', authMiddleware, couponController.checkCoupon);
coupon.get('/coupon-all', couponController.getAllCoupons);
coupon.post('/coupon', authMiddleware, couponController.createCoupon);
coupon.patch('/coupon/:id', authMiddleware, couponController.updateCoupon);
coupon.delete('/coupon/:id', authMiddleware, couponController.deleteCoupon);

module.exports = coupon;