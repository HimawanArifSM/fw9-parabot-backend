const errorResponse = require('../helpers/errorResponse');
const response = require('../helpers/standardResponse');
const productModel = require('../models/product');
const authenticatedModel = require('../models/authenticated')
const {LIMIT_DATA} = process.env;
// customer

// seller
exports.getProfileSeller = (req, res) => {
    const id = req.authUser.id;
    console.log(id);
    authenticatedModel.getProfieSeller(id, (err, results)=>{
        return response(res, 'user with profile', results[0]);
    })
}

exports.updateProfileSeller = (req, res) => {
    const user_id = parseInt(req.authUser.id);
    let filename = null;
    const {full_name, gender, store_name, store_desc, phone_num, bio} = req.body;

    if(req.file){
        filename = req.file.path;
    }

    authenticatedModel.updateProfile(user_id, full_name, gender, filename, store_name, store_desc, phone_num, bio, (err, results) => {
        if (err) {
            return errorResponse(res, `Failed to update: ${err.message}`, null, null, 400);
        }
        return response(res, 'Profile updated', results[0]);
    })
}

exports.updateEmail = (req, res) => {
    const id = parseInt(req.authUser.id);
    authenticatedModel.updateEmail(id, req.body.email, (err)=>{
        if (err) {
            return errorResponse(err, res);
        }else{
            return response(res, 'Edit email successfully');
        }
        })
}

exports.getAllProductsUser = async (req, res) => {
    const idUser = req.authUser.id;
    const {limit=10, page=1}=req.query;
    const offset = (page-1) * limit;
    const pageInfo = {};
    try {
        const products = await productModel.getAllProductsUser(idUser, parseInt(limit,10), offset);
        if(products?.length<1){
            return response(res, 'Failed to get data. Data is empty', null, null, 400);
        } else {
            const countData = await productModel.countAllProductsUser(idUser);
            pageInfo.totalData = countData;
            pageInfo.pages = Math.ceil(countData/limit);
            pageInfo.currentPage = parseInt(page);
            pageInfo.prevPage = pageInfo.currentPage > 1 ? pageInfo.currentPage - 1 : null;
            pageInfo.nextPage = pageInfo.currentPage < pageInfo.pages ? pageInfo.currentPage + 1: null;
            return response(res, 'success get data products', products, pageInfo);
        }
    } catch (error) {
        console.log(error);
        return errorResponse(error, res);
    }
}

exports.getProductById = async (req, res) => {
  // console.log(req.params)
    const idProduct = req.params.id;
    try {
        const product = await productModel.getProductById(parseInt(idProduct, 10));
        if(product.length < 1) {
            return response(res, 'Product not found !!!', null);
        } else {
            return response(res, 'Success get product datas', product);
        }
    } catch (error) {
        console.log(error);
    }
}

exports.createProduct = async (req, res) => {
    const idUser = req.authUser.id;
    req.body.price = parseInt(req.body.price, 10);
    req.body.stock = parseInt(req.body.stock, 10);
    if(req.body.stock_condition){
        if(req.body.stock_condition=='new'){
            req.body.stock_condition = true;
        } else {
            req.body.stock_condition = false;
        }
    }
    if(req.files){
        req.body.product_images = `${req.files.map((el)=>el.path)}`
    }
    req.body.is_archive = false;
    // console.log(req.body)
    // console.log(req.files)
    if(req.body.category_id){
        req.body.category_id = parseInt(req.body.category_id, 10);
    }
    req.body.sold=0;
    
    try {
        req.body.user_id = idUser;
        const product = await productModel.createProduct(req.body);
        return response(res, 'Success create product', product);
    } catch (error) {
        // console.log(error);
        return errorResponse(error, res);
    }
}

exports.updateProduct = async (req, res) => {
    const idProduct = parseInt(req.params.id, 10);
    try {
        if(req.body.is_archive){
            if(req.body.is_archive=='true'){
                req.body.is_archive = true;
            } else {
                req.body.is_archive = false;
            }
        } else {
            req.body.is_archive = false;
        }
        req.body.price = parseInt(req.body.price, 10);
        req.body.stock = parseInt(req.body.stock, 10);
        req.body.discount = parseFloat(req.body.discount/100);
        const product = await productModel.updateProduct(idProduct, req.body);
        return response(res, 'success for update product.', product);
    } catch (error) {
        // console.log(error)
        return errorResponse(error, res);
    }
}

exports.deleteProduct = async (req, res) => {
    const idProduct = parseInt(req.params.id);
    try {
        const product = await productModel.deleteProduct(idProduct);
        return response(res, 'Success deleted product.', product);
    } catch (error) {
        return errorResponse(error, res);
    }
}