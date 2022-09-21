
const wishlist = require('express').Router();
const wishlistController = require('../controllers/wishlist');
const auth = require('../middleware/auth');

// wishlist.get('/all-wishlist',auth,wishlistController.readWishlist);
// wishlist.patch('/update-wishlist/:id', auth, wishlistController.updateWishlist);
wishlist.get('/wishlist/:idProduct', auth, wishlistController.getWishlistByProduct)
wishlist.get('/wishlist-all', auth, wishlistController.getAllWishlist);
wishlist.post('/create-wishlist',auth, wishlistController.createWishlist);
wishlist.patch('/wishlist/:idProduct', auth, wishlistController.updateWishlistFavorite);
wishlist.delete('/wishlist/:id', auth, wishlistController.deleteWishlist);

module.exports=wishlist

