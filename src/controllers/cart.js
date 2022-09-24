const response = require('../helpers/standardResponse');
const cartModel = require('../models/cart');
const errorResponse = require('../helpers/errorResponse');
const productModel = require('../models/product');

exports.getAllCartUser = async (req, res) => {
  const idUser = req.authUser.id;
  const {limit=process.env.LIMIT_DATA, page=1} = req.query;
  const offset = (page-1) * limit;
  const pageInfo = {};
  try {
    const cart = await cartModel.getAllCartUser(parseInt(idUser, 10), parseInt(limit), parseInt(offset));
    if(cart.length < 1) {
      return response(res, 'you don\'t have any cart list.');
    } else {
      const countData = await cartModel.getCountCart(parseInt(idUser, 10));
      pageInfo.totalData = countData;
      pageInfo.pages = Math.ceil(countData/limit);
      pageInfo.currentPage = parseInt(page, 10);
      pageInfo.prevPage = pageInfo.currentPage > 1 ? pageInfo.currentPage - 1 : null;
      pageInfo.nextPage = pageInfo.currentPage < pageInfo.pages ? pageInfo.currentPage + 1 : null;
      return response(res, 'success get all cart', cart, pageInfo);
    }
  } catch (error) {
    console.log(error)
    return response(res, 'no data cart', null, null, 400);
  }
}

exports.getCartUserAndProduct = async (req, res) => {
  const {idProduct} = req.params;
  const idUser = req.authUser.id;
  try {
    const cart = await cartModel.getCartUserAndProduct(parseInt(idProduct, 10), parseInt(idUser, 10))
    return response(res, 'success add product to cart', cart);
  } catch (error) {
    console.log(error)
    return response(res, 'no data cart', null, null, 400);
  }
}

exports.createCart = async (req, res) => {
    const idUser = req.authUser.id;
    try {
        const product_id = parseInt(req.body.product_id, 10);
        const getProduct = await productModel.getProductById(product_id);
        if(getProduct.length<1) { 
          return response(res, 'error!!! product not found', null, null, 400);
        } else {
            const price = getProduct[0].price;
            const totalPrice = parseInt(price, 10) * parseInt(req.body.quantity, 10);
          //data
            const checkingCart = await cartModel.getCartUserAndProduct(parseInt(product_id, 10), parseInt(idUser, 10));
            if(checkingCart.length < 1) {
              req.body.user_id = idUser;
              req.body.product_id = parseInt(req.body.product_id, 10);
              req.body.quantity = parseInt(req.body.quantity, 10);
              req.body.total_price = totalPrice;
              const cart = await cartModel.createCart(req.body);
              return response(res, 'success add new cart', cart);
            } else {
              const newData = [];
              checkingCart.forEach( async e => {
                newData.push(e.is_deleted);
                if(e.is_deleted == false) {
                  req.body.quantity = parseInt(req.body.quantity, 10);
                  const data = {qty: req.body.quantity, price: parseInt(price, 10), quantity: e.quantity}
                  const cart = await cartModel.updateQuantityCart(parseInt(e.id, 10), data);
                  return response(res, 'success add product to cart', cart);
                }
              })
              const newDataFilter = newData.filter(e => e === false);
              if(newDataFilter.length < 1) {
                req.body.user_id = idUser;
                req.body.product_id = parseInt(req.body.product_id, 10);
                req.body.quantity = parseInt(req.body.quantity, 10);
                req.body.total_price = totalPrice;
                const cart = await cartModel.createCart(req.body);
                return response(res, 'success add new cart', cart);
              }
              // console.log(newData);
            }
        }
    } catch (error) {
        // console.log(error);
        return errorResponse(error, res);
    }    
}

exports.updateCartUser = async (req, res) => {
  const {id} = req.params;
  const product_id = parseInt(req.body.product_id, 10);
  try {
    const getProduct = await productModel.getProductById(product_id);
    if(getProduct.length<1) { 
      return response(res, 'error!!! product not found', null, null, 400);
    } else {
      const price = getProduct[0].price;
      const data = {price: parseInt(price, 10), quantity: req.body.quantity, coupon_id: parseInt(req.body.coupon_id, 10), shipping: req.body.shipping}
      const cart = await cartModel.updateCartUser(parseInt(id, 10), data);
      return response(res, 'success update cart', cart);
    }
  } catch (error) {
    console.log(error);
    return errorResponse(error, res);
  }
}

exports.updateQuantityCart = async (req, res) => {
  const {id, idProduct} = req.params;
  try {
    const getProduct = await productModel.getProductById(parseInt(idProduct, 10));
    if(getProduct.length<1) { 
      return response(res, 'error!!! product not found', null, null, 400);
    } else {
      const price = getProduct[0].price;
      const data = {price: parseInt(price, 10), quantity: req.body.quantity}
      const cart = await cartModel.updateQuantityCart(parseInt(id, 10), data);
      return response(res, 'success update cart', cart);
    }
  } catch (error) {
    return errorResponse(error, res);
  }
}

exports.deleteCartUser = async (req, res) => {
  const {id} = req.params;
  try {
    const cart = await cartModel.deleteCartUser(parseInt(id, 10));
    if(cart != null) {
      return response(res, 'success to deleted cart.');
    } else{
      return response(res, 'failed to deleted cart.', null, null, 400);
    }
    // console.log(cart);
  } catch (error) {
    // console.log(error);
    return errorResponse(error, res);
  }
}

exports.updateCart=(req, res)=>{
    const { id } = req.params;
    cartModel.updateCart(id, req.body, (err)=>{
      if(err){
        return errorResponse(err,res);
      }
      else{
        return response(res, 'Create user succesfully');
      }
    });
};

exports.createOrder=(req, res)=>{
    const {payment_status= 'pending'}=req.query
    cartModel.createOrder(payment_status, req.body, (err)=>{
      if(err){
        return errorResponse(err,res);
      }
      else{
        return response(res, 'Create user succesfully');
      }
    });
};

exports.getCartUser=(req, res)=>{
    const id = parseInt(req.authUser.id)
    cartModel.getCartUser(id, (err, results)=>{
      if(err){
        return errorResponse(err,res);
      }
      else{
        return response(res, 'Get all cart user succesfully', results.rows);
      }
    });
};