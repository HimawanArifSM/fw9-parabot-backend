
const wishlistModel = require('../models/wishlist');
const errorResponse = require('../helpers/errorResponse');
const response = require('../helpers/standardResponse');

exports.readWishlist = async(req,res)=>{
    const id = parseInt(req.authUser.id);
    const wishlist = await wishlistModel.readWishlistModel(id);
    if(wishlist.error){
        return errorResponse(wishlist.error,res);
    }
    if(wishlist.data){
        return response(res,'Showing wishlist',wishlist.data);
    }
}

exports.updateWishlist=(req, res)=>{
    const { id } = req.params;
    wishlistModel.updateWishlist.updateWishlist(id, req.body, (err)=>{
      if(err){
        return errorResponse(err,res);
      }
      else{
        return response(res, 'Create user succesfully');
      }
    });
  };


exports.createWishlist = async (req, res) => {
    const idUser = req.authUser.id;
    try {
        req.body.product_id = parseInt(req.body.product_id, 10);
        req.body.user_id = idUser;
        if(req.body.is_favorite == 'true'){
            req.body.is_favorite = true;
        } else {
            req.body.is_favorite = false;
        }
        const wishlist = await wishlistModel.createWishlist(req.body)
        return response(res, 'success add product to wishlist', wishlist);
    } catch (error) {
        return errorResponse(error, res);
    }
}

exports.getWishlistByProduct = async (req, res) => {
    const idUser = req.authUser.id;
    const idProduct = parseInt(req.params.idProduct, 10);
    try {
       req.body.user_id = parseInt(idUser, 10);
       const wishlist = await wishlistModel.getWishlistByProduct(idProduct, req.body.user_id);
       if(wishlist.length < 1){
        return response(res, 'no data wishlist', wishlist, null, 400);
       } else {
        return response(res, 'success get product to wishlist', wishlist[0]);
       }
    } catch (error) {
        return errorResponse(error, res)
    }
}

exports.updateWishlistFavorite = async (req, res) => {
    const idUser = req.authUser.id;
    const idProduct = parseInt(req.params.idProduct, 10);
    try {
       req.body.user_id = parseInt(idUser, 10);
       req.body.product_id = parseInt(req.body.product_id, 10);
       if(req.body.is_favorite == 'true'){
        req.body.is_favorite = true;
       } else {
        req.body.is_favorite = false;
       }
       const wishlist = await wishlistModel.updateWishlistFavorite(idProduct, req.body.user_id, req.body.is_favorite);
       return response(res, 'success update favorite', wishlist);
    } catch (error) {
        console.log(error)
        return errorResponse(error, res)
    }
}

exports.getAllWishlist = async (req, res) => {
    const idUser = parseInt(req.authUser.id, 10);
    const {limit=process.env.LIMIT_DATA, page=1} = req.query;
    const offset = (page - 1) * limit;
    const pageInfo = {};
    try {
        // req.body.user_id = parseInt(idUser, 10);
        const wishlist = await wishlistModel.getAllWishlist(idUser);
        if(wishlist.length < 1) {
            return response(res, 'you don\'t have any wishlist list.');
        } else {
            const countData = await wishlistModel.getCountWishlist(idUser);
            pageInfo.totalData = countData;
            pageInfo.pages = Math.ceil(countData/limit);
            pageInfo.currentPage = parseInt(page);
            pageInfo.prevPage = pageInfo.currentPage > 1 ? pageInfo.currentPage - 1 : null;
            pageInfo.nextPage = pageInfo.currentPage < pageInfo.pages ? pageInfo.currentPage + 1 : null;
            return response(res, 'success get all wishlist', wishlist, pageInfo);
        }
     } catch (error) {
         return errorResponse(error, res)
     }
}

exports.deleteWishlist = async (req, res) => {
    const {id} = req.params;
    try {
        const wishlist = await wishlistModel.deleteWishlist(parseInt(id, 10));
        return response(res, 'success get product to wishlist', wishlist);
    } catch (error) {
        return errorResponse(error, res);
    }
}