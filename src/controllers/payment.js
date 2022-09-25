const errorResponse = require('../helpers/errorResponse');
const response = require('../helpers/standardResponse');
const paymentModel = require('../models/payment');

exports.createPayment = async (req, res) => {
    let filename = null;
    try {
        if(req.files) {
            filename = req.files[0].path;
            req.body.logo = filename;
        }
        const payment = await paymentModel.createPayment(req.body);
        return response(res, 'success craeted  payment method', payment);
    } catch (error) {
        console.log(error)
        return errorResponse(error, res);
    }
}

exports.getAllPayment = async (req, res) => {
    try {
        const payments = await paymentModel.getAllPayments();
        return response(res, 'success get all payment', payments);
    } catch (error) {
        return errorResponse(error, res);
    }
}