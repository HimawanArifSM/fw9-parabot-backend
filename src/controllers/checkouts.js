const checkoutsModel = require("../models/checkouts");
const errorResponse = require('../helpers/errorResponse');
const response = require('../helpers/standardResponse');

exports.getAll = async (req, res) => {
    const checkouts = await checkoutsModel.getAllCheckouts();
    return res.json({
      success: true,
      message: "List checkouts",
      results: checkouts
    });
  };

exports.post = async (req, res) => {
    const data = {
        name: req.body.name,
        phone_number: req.body.phone_number,
        address: req.body.address,
        payment_id: parseInt(req.body.payment_id)
    }
    
    try {
        const checkouts = await checkoutsModel.create(data);
        return res.json({
            success: true,
            message: "Create checkouts success",
            results: checkouts
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Failed to created checkout."
        });
    }
};