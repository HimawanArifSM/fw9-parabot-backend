const errorResponse = require('../helpers/errorResponse');
const response = require('../helpers/standardResponse');
const productModel = require('../models/product');
const {LIMIT_DATA} = process.env;

exports.getAllProduct = async (req, res) => {
    const {searchBy='product_name',search='',sortBy='created_at',sort='asc',limit=12, page=1}=req.query;
    const offset = (page-1) * parseInt(limit);
    console.log(parseInt(offset, 10));
    try {
        const products = await productModel.getAllProducts(searchBy,search,sortBy,sort,limit,parseInt(offset, 10));
        const pageInfo = {};
        productModel.countAllProductsModel(searchBy,search,(err,totalusers)=>{
            pageInfo.totalData = totalusers;
            pageInfo.totalPage = Math.ceil(totalusers/limit);
            pageInfo.curretPage = parseInt(page);
            pageInfo.nextPage = pageInfo.curretPage < pageInfo.totalPage? pageInfo.curretPage+1:null;
            pageInfo.prevPage = pageInfo.curretPage > 1 ? pageInfo.curretPage-1:null;
            return response(res, 'Success get all Products', products,pageInfo);
        });
    } catch (error) {
        console.log(error);
        return errorResponse(error, res);
    }
}

exports.getProducts = (req, res) => {
    const {search = '', sort = 'created_at',sortBy = 'DESC', limit=parseInt(LIMIT_DATA), page=1, category = '', color = '', brand = ''} = req.query;
    const offset = (page - 1) * limit;
    productModel.getProducts(search, sort, sortBy, limit, offset, category, color, brand, (results) => {
        if (results.length < 1) {
            return res.redirect('/404');
        }
        const pageInfo = {};
    
        productModel.getProductsCount(search, category, color, brand, (err, totalData)=>{
        pageInfo.totalData = totalData;
        pageInfo.totalPage = Math.ceil(totalData/limit);
        pageInfo.currentPage = parseInt(page, 10);
        pageInfo.nextPage = pageInfo.currentPage < pageInfo.totalPage ? pageInfo.currentPage + 1 : null;
        pageInfo.prevPage = pageInfo.currentPage > 1 ? pageInfo - 1 : null;
        return response(res, 'List all products search', results, pageInfo);
        });
    })
}

exports.getProductCategoryCount = (req, res) => {
    productModel.countEveryCategory((err, results) => {
        return response(res, 'list count every category', results)
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
        if(req.body.price){
            req.body.price = parseInt(req.body.price, 10);
        }
        if(req.body.stock){
            req.body.stock = parseInt(req.body.stock, 10);
        }
        if(req.body.discount){
            req.body.discount = parseFloat(req.body.discount/100);
        }
        const product = await productModel.updateProduct(idProduct, req.body);
        return response(res, 'success for update product.', product);
    } catch (error) {
        console.log(error)
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