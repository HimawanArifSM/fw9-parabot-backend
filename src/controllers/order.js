const errorResponse = require('../helpers/errorResponse');
const response = require('../helpers/standardResponse');
const orderModel = require('../models/order');

exports.createOrderPaid = async (req, res) => {
    req.body.user_id = parseInt(req.authUser.id, 10);
    try {
        const order = await orderModel.createOrder(req.body);
        if (typeof order != 'object') {
            return response(res, 'Failed to order. Try again.', null, null, 400);
        } else {
            return response(res, 'success order', order);
        }
    } catch (error) {
        return errorResponse(error, res);
    }
}

exports.getAllOrder = async (req, res) => {
    const {type} = req.query;
    try {
        const order = await orderModel.getOrderForSeller(type);
        return response(res, `success get data with type ${type}.`, order);
    } catch (error) {
        return errorResponse(error, res);
    }
}