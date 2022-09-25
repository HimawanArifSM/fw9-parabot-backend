const errorResponse = require('../helpers/errorResponse');
const response = require('../helpers/standardResponse');
const couponModel = require('../models/coupon');

exports.checkCoupon = async (req, res) => {
    const {code} = req.params
    try {
        const coupon = await couponModel.checkCoupon(code.toLocaleUpperCase());
        if(coupon.length < 1) {
            return response(res, 'Coupon not available.', null, null, 400);
        } else {
            return response(res, 'Coupon available.', coupon[0], null, 200);
        }
    } catch (error) {
        return errorResponse(error, res);
    }
}

exports.getAllCoupons = async (req, res) => {
    try {
        const coupons = await couponModel.getAllCoupons();
        if(coupons) {
           return response(res, 'success get all coupons', coupons);
        } else {
           return response(res, 'no list data of coupons.')
        }
    } catch (error) {
        return errorResponse(error, res);
    }
}

exports.createCoupon = async (req, res) => {
    if(req.body.discount) {
        req.body.discount = parseInt(req.body.discount) / 100;
    }
    if(req.body.code) {
        req.body.code = req.body.code.toLocaleUpperCase('en-US');
    }
    try {
        const coupon = await couponModel.createCoupon(req.body);
        if (typeof coupon !== 'object') {
            return response(res, `${coupon}`, null, null, 400);
        } else if (coupon === 'object') {
            return response(res, 'success created coupon', coupon);
        }
    } catch (error) {
        console.log(error)
        return errorResponse(error, res);
    }
}

exports.updateCoupon = async (req, res) => {
    const {id} = req.params;
    if(req.body.discount) {
        req.body.discount = parseInt(req.body.discount) / 100;
    }
    if(req.body.code) {
        req.body.code = req.body.discount.toLocaleUpperCase();
    }
    try {
        const coupon = await couponModel.updateCoupon(parseInt(id, 10), req.body);
        return response(res, 'success update coupon', coupon);
    } catch (error) {
        console.log(error)
        return errorResponse(error, res);
    }   
}

exports.deleteCoupon = async (req, res) => {
    const {id} = req.params;
    try {
        const coupon = await couponModel.deleteCoupon(parseInt(id, 10));
        return response(res, 'success to delete coupon', coupon);
    } catch (error) {
        return errorResponse(error, res);
    }
}