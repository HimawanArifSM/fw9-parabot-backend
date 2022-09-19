const prisma = require("../helpers/prisma")
const db = require('../helpers/db');
const {LIMIT_DATA} = process.env;


exports.getAllProducts = async (searchBy,search,sortBy,sort,limit,offset) => {
    const products = await prisma.products.findMany({
        skip:offset,
        take:limit,
        where: {
            is_archive: false,
            AND:{
                product_name:{
                    contains:`${search}`
                }
            }
        },
        orderBy:{
            ...(sortBy==='product_name'?{product_name : sort}:sortBy==='price'?{price:sort}:sortBy==='created_at'?{created_at:sort}:{})
        },
    });
    return products;
}

exports.getAllProductsUser = async (idUser, limit, offset) => {
    const product = await prisma.products.findMany({
        skip: offset,
        take: limit,
        where: {
            user_id: idUser
        },
        orderBy: {
            created_at: 'desc'
        }
    });
    return product;
}

exports.countAllProductsUser = async (idUser) => {
    const countData = await prisma.products.count({
        where: {
            user_id: idUser
        }
    });
    return countData;
}

exports.countAllProductsModel=(searchBy,search,cb) =>{
    const que = `SELECT * FROM products WHERE ${searchBy} LIKE '%${search}%'`
    db.query(que,(err,res)=>{
        if(err){
            cb(err);
        }else{
            cb(err,res.rowCount);
        }
    })
}

exports.getProductById = async (id) => {
    const product = await prisma.products.findMany({
        where: {
            id: id
        },
        include: {
            categories: true,
            reviews: true,
            wishlist: true,
            cart: true
        }
    });
    return product;
}

exports.createProduct = async (data) => {
    
    const product = await prisma.products.create({
        data: {
                // ...data
                product_name: data.product_name,
                description: data.description,
                price: data.price,
                stock: data.stock,
                stock_condition: data.stock_condition,
                color: data.color,
                brand: data.brand,
                category_id: data.category_id,
                sku: data.sku,
                product_images: data.product_images,
                is_archive: data.is_archive,
                sold: data.sold,
                user_id: data.user_id
            }
        });
    console.log(product);
    return product;
}

exports.updateProduct = async (id, data) => {
    const product = await prisma.products.update({
        where: {
            id: id
        },
        data: {
            ...data
        }
    })
    return product;
}

exports.deleteProduct = async (id) => {
    const product = await prisma.products.delete({
        where:{
            id: id
        }
    });
    return product;
}

// get all products
exports.getProducts = (search, sort, sortBy, limit=parseInt(LIMIT_DATA), offset=0, category, color, brand, cb) => {
    db.query(`SELECT products.id, product_name, price, product_images, categories.category_name FROM products FULL OUTER JOIN categories ON categories.id = products.category_id WHERE (product_name ILIKE '%${search}%') AND is_archive = false AND categories.category_name ILIKE '%${category}%' AND products.color ILIKE '%${color}%' AND products.brand ILIKE '%${brand}%' ORDER BY products.${sort} ${sortBy} LIMIT $1 OFFSET $2`, [limit, offset], (err, res) => {
        cb(res.rows);
    })
}

exports.getProductsCount = (search, category, color, brand, cb) => {
    db.query(`SELECT * FROM products FULL OUTER JOIN categories ON categories.id = products.category_id WHERE (product_name ILIKE '%${search}%') AND is_archive = false AND categories.category_name ILIKE '%${category}%' AND products.color ILIKE '%${color}%' AND products.brand ILIKE '%${brand}%'`, (err, res) => {
        cb(err, res.rowCount)
    })
}

exports.countEveryCategory = (cb) => {
    db.query('SELECT categories.category_name, COUNT (categories.category_name) FROM products FULL OUTER JOIN categories ON categories.id = products.category_id WHERE is_archive = false GROUP BY categories.category_name', (err, res) => {
        cb(err, res.rows)
    })
}
// get all products