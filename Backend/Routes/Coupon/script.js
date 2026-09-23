const express = require('express');
const router = express.Router();
const { createCoupon, verifyCoupon, getCoupons, deleteCoupon, toggleCouponStatus } = require("../../Controller/Coupon/script");

router.post("/createCoupon", createCoupon);
router.post("/verifyCoupon", verifyCoupon);
router.get("/getCoupons", getCoupons);
router.delete("/deleteCoupon/:id", deleteCoupon);
router.put("/toggleCoupon/:id", toggleCouponStatus);

module.exports = router;

