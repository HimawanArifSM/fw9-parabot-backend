const db = require("../helpers/db");
const prisma = require("../helpers/prisma");

exports.getAllCartUser = async (user_id, limit, offset) => {
  console.log(limit, offset)
  const cart = await prisma.cart.findMany({
    skip: offset,
    take: limit,
    where: {
      user_id: user_id,
      AND: {
        is_deleted: false,
        AND: {
          is_paid: false,
        }
      }
    },
    include: {
      products: {
        select: {
          id: true,
          product_images: true,
          product_name: true,
          price: true,
        }
      },
      coupons: true,
      users: {
        select: {
          id: true,
          username: true,
          profiles: {
            select: {
              full_name: true,
              image: true,
              phone_num: true,
            }
          }
        },
      },
    }
  });
  return cart;
}

exports.getCountCart = async (user_id) => {
  const countData = await prisma.cart.count({
    where: {
      user_id: user_id,
      AND: {
        is_deleted: false,
        AND: {
          is_paid: false,
        }
      }
    }
  });
  return countData;
}

exports.getCartUserAndProduct = async (product_id, user_id) => {
  const cart = await prisma.cart.findMany({
    where: {
      product_id: product_id,
      AND: {
        user_id: user_id
      }
    },
  });
  return cart;
}

exports.createCart = async (data) => {
    const cart = await prisma.cart.create({
        data,
        include: {
            products: true,
            coupons: true, 
            orders: true
        }
    })
    return cart;
}

exports.updateQuantityCart = async (idCart, data) => {
  const cart = await prisma.cart.update({
    where: {
      id: idCart
    }, 
    data: {
      quantity:  !data.qty ? data.quantity : parseInt(data.quantity, 10) + data.qty,
      total_price: !data.qty ? (parseInt(data.quantity, 10) * data.price) : (parseInt(data.quantity, 10) + data.qty) * data.price,
    }
  })
  return cart;
}
exports.updateCartUser = async (idCart, data) => {
  const cart = await prisma.cart.update({
    where: {
      id: idCart
    }, 
    data: {
      quantity:  data.quantity,
      total_price: parseInt(data.quantity, 10) * data.price,
      coupon_id: data.coupon_id,
      shipping: data.shipping, 
    }
  })
  return cart;
}

exports.deleteCartUser = async (idCart) => {
  const cart = await prisma.cart.update({
    where: {
      id: idCart,
    },
    data: {
      is_deleted: true,
    }
  });
  return cart;
};

exports.updateCart=(id, data, cb)=>{
    let val = [id];
    const filtered = {};
    const obj ={product_id: data.product_id, 
      user_id:data.user_id, 
      quantity:data.quantity, 
      total_price:data.total_price,
    shipping: data.shipping,
    coupon_id: data.coupon_id};
    for(let x in obj){
      if(obj[x]!==null){
        if(obj[x]!==undefined){
          console.log(obj[x]);
          filtered[x]=obj[x];
          val.push(obj[x]);
        }
      }
    }
    const key = Object.keys(filtered);
    const finalResult = key.map((o, ind)=>`${o}=$${ind+2}`);
    const q = `UPDATE cart SET ${finalResult} WHERE user_id=$1 RETURNING *`;
    db.query(q, val, (err, res)=>{
      console.log(res);
      if(res){
        cb(err, res);
      }else{
        cb(err);
      }
      // cb(res.rows);
    });
  };

exports.createOrder=(status_payment, data, cb)=>{
    const filtered = {};
    const obj ={cart_id: data.cart_id, 
      status_payment:status_payment, 
      checkout_id:data.checkout_id};
    for(let x in obj){
      if(obj[x]!==null){
        if(obj[x]!==undefined){
          console.log(obj[x]);
          filtered[x]=obj[x];
          val.push(obj[x]);
        }
      }
    }
    const key = Object.keys(filtered);
    const finalResult = key.map((o, ind)=>`${o}=$${ind+2}`);
    const q = `INSERT INTO order (${key}) VALUES (${finalResult}) RETURNING *`;
    db.query(q, val, (err, res)=>{
      console.log(res);
      if(res){
        cb(err, res);
      }else{
        cb(err);
      }
      // cb(res.rows);
    });
};

exports.getCartUser = (id, cb)=>{
    const q = 'SELECT * FROM products join cart on cart.product_id=products.id WHERE cart.user_id=$1';
    const val = [id];
    db.query(q, val, (err, res)=>{
      // console.log(res);
      if(res){
        cb(err, res);
      }else{
        console.log(err);
        cb(err);
      }
    });
  };
  