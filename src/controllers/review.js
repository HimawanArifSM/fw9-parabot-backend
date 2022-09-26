const response = require('../helpers/standardResponse');
const errorResponse = require('../helpers/errorResponse');
const reviewModels = require('../models/review');
const authModel = require('../models/auth');

exports.createReview = async (req,res) => {
    const userLogin = req.authUser.id
    try{
        authModel.getUserByEmail(req.body.email,(err,result)=>{
            if(err){
                return errorResponse(err,res)
            }
            if(result.rowCount<1){
                return response(res,'Email not registered', null, null, 400);
            }
            if (userLogin!==result.rows[0].id) {
                return response(res, 'Your Email is wrong', null, null, 400);
            } else {
                req.body.rating = parseInt(req.body.rating, 10);
                req.body.product_id = parseInt(req.body.product_id, 10);
                const {rating,product_id,content} = req.body
                const data = {user_id: userLogin,rating,product_id,content}
                const resulting = reviewModels.createValueModel(data);
                return response(res, 'Review Sent', resulting);
            }
        });
    }
    catch(err){
        console.log(err);
        return errorResponse(err,res)
    }
};

exports.getReview = async (req, res) => {
    const pageInfo = {};
    try{
        const {productId,limit=process.env.LIMIT_DATA, page=1} = req.query;
        const offset = (page-1) * limit;
        const results = await reviewModels.getReviewModel(parseInt(productId),parseInt(offset),parseInt(limit));
        if(results.rowCount<1){
            return response(res, 'No Review')
        } else {
            const countData = await reviewModels.getCountReview(parseInt(productId, 10));
            pageInfo.totalData = countData;
            pageInfo.pages = Math.ceil(countData/limit);
            pageInfo.currentPage = parseInt(page, 10);
            pageInfo.prevPage = pageInfo.currentPage > 1 ? pageInfo.currentPage - 1 : null;
            pageInfo.nextPage = pageInfo.currentPage < pageInfo.pages ? pageInfo.currentPage + 1 : null;
            return response(res,'Showing all review', results, pageInfo);
        }
    }
    catch(err){
        console.log(err);
        return errorResponse(err,res)
    }
}