
const checkouts = require("express").Router();
const checkoutsController = require("../controllers/checkouts");
const authMiddleware = require('../middleware/auth')

checkouts.get("/", authMiddleware, checkoutsController.getAll);
checkouts.post("/", authMiddleware, checkoutsController.post);

module.exports = checkouts;
