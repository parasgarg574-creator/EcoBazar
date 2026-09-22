const express = require('express');
const router = express.Router();
const {createOrder,verifyPayment} = require("../../Controller/Payment/script");
router.post("/create-order",createOrder);
router.post("/verify-payment",verifyPayment);
module.exports = router