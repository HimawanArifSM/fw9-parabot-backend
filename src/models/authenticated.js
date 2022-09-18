const db = require("../helpers/db");
// customer

// seller
exports.getProfieSeller = (id, cb) => {
  db.query(`SELECT email, profiles.full_name, profiles.image , profiles.gender, profiles.store_name, profiles.store_desc FROM users JOIN profiles ON profiles.user_id = users.id WHERE users.id = ${id}`, (err, res)=>{
    cb(err, res.rows);
  })
};

exports.updateProfile = (user_id, full_name, gender, image, store_name, store_desc, phone_num, bio, cb) => {
  let val = [user_id];

  const filtered = {};
  const objt = {
    full_name, 
    gender, 
    image, 
    store_name, 
    store_desc, 
    phone_num, 
    bio,
  };

  for(let x in objt){
    if (objt[x]!==null) {
      if(objt[x]!==undefined){
        filtered[x] = objt[x];
        val.push(objt[x]);
      }
    }
  }
  const key = Object.keys(filtered);
  const finalResult = key.map((o, ind)=> `${o}=$${ind+2}`);
  const q = `UPDATE profiles SET ${finalResult} WHERE user_id=$1 RETURNING full_name, gender, image, store_name, store_desc, phone_num, bio`
  db.query(q, val, (err, res)=>{
    cb(err, res.rows);
  });
}

exports.updateEmail = (id, email, cb) => {
  const q = 'UPDATE users SET email=$1 WHERE id=$2';
  const val = [email, id];
  db.query(q, val, (err, res)=>{
    if (res) {
      cb(err, res);
    }else{
      cb(err);
    }
  });
}