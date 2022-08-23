const favoriteModel = require('../models/favorite');
const errorResponse = require('../helpers/errorResponse');
const response = require('../helpers/standardResponse');

exports.createWFavorite = async(req,res)=>{
    const id = req.authUser.id;
    const wishlist = await favoriteModel.createFavoriteModel(id,req.body);
    if(wishlist.error){
        return errorResponse(wishlist.error,res);
    }
    if(wishlist.data){
        return response(res,'favorite created',wishlist.data);
    }
};

exports.readFavorite = async(req,res)=>{
    const id = parseInt(req.authUser.id);
    const wishlist = await favoriteModel.readFavoriteModel(id);
    if(wishlist.error){
        return errorResponse(wishlist.error,res);
    }
    if(wishlist.data){
        return response(res,'Showing favorite',wishlist.data);
    }
}

exports.updateFavorite=(req, res)=>{
    const { id } = req.params;
    favoriteModel.updateFavorite(id, req.body, (err)=>{
      if(err){
        return errorResponse(err,res);
      }
      else{
        return response(res, 'Update favorite succesfully');
      }
    });
};

exports.deleteFavorite = async(req,res)=>{
    const { id } = req.params;
    const wishlist = await favoriteModel.deleteFavoriteModel(id);
    if(wishlist.error){
        return errorResponse(wishlist.error,res);
    }
    if(wishlist.data){
        return response(res,'Delete favorite successd');
    }
}