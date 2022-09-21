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
    const {type} = req.params;
    const {page=1, limit=parseInt(process.env.LIMIT_DATA, 10)} = req.query;
    const offset = (page - 1) * limit;
    const pageInfo = {};
    try {
        const order = await orderModel.getAllOrder(type, req.body.seller_id ? parseInt(req.body.seller_id, 10) : null, req.body.custumer_id ? parseInt(req.body.custumer_id, 10) : null, limit, offset);
        if(order.length < 1) {
            return response(res, 'Your shop not have orders list.');
        } else {
            const countData = await orderModel.countOrderList(type, req.body.seller_id ? parseInt(req.body.seller_id, 10) : null, req.body.custumer_id ? parseInt(req.body.custumer_id, 10) : null);
            pageInfo.totalData = countData;
            pageInfo.pages = Math.ceil(countData/limit);
            pageInfo.currentPage = parseInt(page, 10);
            pageInfo.prevPage = pageInfo.currentPage > 1 ? pageInfo.currentPage - 1 : null;
            pageInfo.nextPage = pageInfo.currentPage < pageInfo.pages ? pageInfo.currentPage + 1 :  null;
            return response(res, `success get data with type ${type}.`, order, pageInfo);
        }
    } catch (error) {
        console.log(error);
        return errorResponse(error, res);
    }
}

exports.updateStatusOrder = async (req, res) => {
    const {id} = req.params;
    try {
        const order = await orderModel.updateStatusOrder(parseInt(id, 10), req.body);
        return response(res, `success change order to ${req.body.type}.`, order);
    } catch (error) {
        return errorResponse(error, res);
    }
}

exports.getDetailsOrder = async (req, res) => {
    const {id} = req.params;
    try {
        const order = await orderModel.getDetailsOrder(parseInt(id, 10));
        return response(res, 'success get details order.', order);
    } catch (error) {
        return errorResponse(error, res)
    }
}