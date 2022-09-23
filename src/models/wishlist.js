
const prisma = require('../helpers/prisma');
const db = require('../helpers/db');

exports.readWishlistModel = async(id) => {
    const result = {};
    try{
        const wishlist = await prisma.wishlist.findMany({
            where:{
                user_id: id,
                is_favorite: false
            }
        });
        result.data = wishlist
        return result
    }
    catch(e){
        result.error = e;
        return result
    }
};


exports.updateWishlist =(id, data, cb)=>{
    db.query('BEGIN', err=>{
      if(err){
        console.log('error 1');
      }else{
        const q = 'INSERT INTO cart (user_id, product_id, quantitiy) VALUES ($1, $2, $3) RETURNING *';
        const val = [data.user_id, data.product_id, data.quantity];
        db.query(q, val, (err, res)=>{
          if(err){
            console.log('error 2');
          }else{
            const q2= 'DELETE FROM wishlist WHERE ID=$1 RETURNING *';
            const val2 = [id];
            // console.log(id);
            db.query(q2, val2, (err, res)=>{
              console.log(err);
              if(err){
                console.log('error 3');
              }else{
                cb(err, res);
                db.query('COMMIT', err=>{
                  if(err){
                    console.error('Failed add to cart', err.stack);
                  }
                });
              }
            });
          }
        });
      }
    });
  };


exports.createWishlist = async (data) => {
    const wishlist = await prisma.wishlist.create({
        data
    });
    return wishlist;
}

exports.getWishlistByProduct = async (product_id, user_id) => {
  const wishlist = await prisma.wishlist.findMany({
    where: {
      product_id: product_id,
      AND:{
        user_id: user_id,
      }
    }
  });
  return wishlist;
}

exports.updateWishlistFavorite = async (id, is_favorite) => {
  const wishlist = await prisma.wishlist.update({
    where: {
      id: id,
    },
    data:{
      is_favorite: is_favorite
    },
  });
  // const wishlist = await prisma.products.update({
  //   where: {
  //     id:{
  //       product_id: product_id
  //     },
  //   }
  // })
  return wishlist
}

exports.getAllWishlist = async (user_id, limit, offset) => {
  const wishlist = await prisma.wishlist.findMany({
    skip: offset,
    take: limit,
    where: {
      user_id: user_id,
      // AND: {
      //   is_deleted: false
      // },
    },
    include: {
      products: {
        select: {
          product_images: true,
          price: true,
          product_name: true,
          stock: true,
          sold: true,
        }
      }
    } 
  });
  return wishlist;
}

exports.getCountWishlist = async (user_id) => {
  const countData = await prisma.wishlist.count({
    where: {
      user_id: user_id,
      AND: {
        is_deleted: false,
      }
    }
  });
  return countData;
}

exports.deleteWishlist = async (id) => {
  const wishlist = await prisma.wishlist.update({
    where: {
      id: id
    },
    data: {
      is_deleted: true
    }
  });
  return wishlist;
}

exports.recoverWishlist = async (id) => {
  const wishlist = await prisma.wishlist.update({
    where: {
      id: id
    },
    data: {
      is_deleted: false
    }
  });
  return wishlist;
}