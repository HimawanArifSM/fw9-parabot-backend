const router = require('express').Router();

//Penggunaan route silahkan sesuaikan denggan kebutuhan


//Profile
const profileCustomerRoutes = require("../routers/profileCustomer");
const profileSellerRoutes = require("../routers/profileSeller");

router.use("/", profileCustomerRoutes);
router.use("/", profileSellerRoutes);


router.use('/',require('./chats'));
router.use("/checkouts", require("./checkouts"));
router.use('/',require('./notification'));

//dari himawan
router.use('/', require('./favorite'));
router.use('/', require('./wishlist'));

//dari master??
router.use('/', require('./product'));
router.use('/',require('./auth'))
router.use('/', require('./categories'));
router.use('/', require('./wishlist'));
router.use('/', require('./cart'));
router.use('/', require('./order'));
router.use('/', require('./coupon'));
router.use('/', require('./payment'));

// authenticated seller
router.use('/authenticated-seller', require('./authenticatedSeller'));
router.use('/authenticated-costumer', require('./authenticatedCustomer'));

module.exports=router


