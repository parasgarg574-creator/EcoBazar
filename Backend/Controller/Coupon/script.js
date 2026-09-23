const Coupon = require("../../Modles/Coupon/script");

const createCoupon = async (req, res) => {
    try {
        const { code, discountType, discountvalue, minDiscount, maxDiscount, minOrderAmount, usageLimit, expiresAt} = req.body;
        if (
            !code ||
            !discountType ||
            discountvalue === undefined ||
            !expiresAt
        ) {
            return res.status(400).json({
                success: false,
                message: "Please enter required fields"
            });
        }
        if (!["percentage", "fixed"].includes(discountType)) {
            return res.status(400).json({
                success: false,
                message: "Discount must be percentage or fixed"
            });
        }
        if (discountvalue <= 0) {
            return res.status(400).json({
                success: false,
                message: "Discount value must be greater than 0"
            });
        }
        if (discountType === "percentage" && discountvalue > 100) {
            return res.status(400).json({
                success: false,
                message: "Percentage discount cannot exceed 100%"
            });
        }
        if (minDiscount !== undefined && minDiscount < 0) {
            return res.status(400).json({
                success: false,
                message: "Minimum discount cannot be negative"
            });
        }
        if (maxDiscount !== undefined && maxDiscount < 0) {
            return res.status(400).json({
                success: false,
                message: "Maximum discount cannot be negative"
            });
        }
        if (
            minDiscount !== undefined &&
            maxDiscount !== undefined &&
            minDiscount > maxDiscount
        ) {
            return res.status(400).json({
                success: false,
                message: "Minimum discount cannot be greater than maximum discount"
            });
        }
        if (new Date(expiresAt) <= new Date()) {
            return res.status(400).json({
                success: false,
                message: "Expiry date must be in the future"
            });
        }
        const existingCoupon = await Coupon.findOne({
            code: code.toUpperCase()
        });
        if (existingCoupon) {
            return res.status(409).json({
                success: false,
                message: "Coupon already exists"
            });
        }
        const coupon = await Coupon.create({
            code: code.toUpperCase(),
            discountType,
            discountvalue,
            minDiscount: minDiscount ?? 0,
            maxDiscount: maxDiscount ?? null,
            minOrderAmount: minOrderAmount ?? 0,
            usageLimit: usageLimit ?? null,
            expiresAt
        });
        return res.status(201).json({
            success: true,
            message: "Coupon created successfully",
            coupon
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
const verifyCoupon = async (req, res) => {
    try {
        const { code, orderAmount } = req.body;
        if (!code || orderAmount === undefined) {
            return res.status(400).json({
                success: false,
                message: "Please enter the required fields"
            });
        }
        if (orderAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Order amount must be greater than 0"
            });
        }
        const coupon = await Coupon.findOne({
            code: code.toUpperCase()
        });
        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Coupon not found"
            });
        }
        if (!coupon.isActive) {
            return res.status(400).json({
                success: false,
                message: "Coupon is inactive"
            });
        }
        if (new Date() > coupon.expiresAt) {
            return res.status(400).json({
                success: false,
                message: "Coupon expired"
            });
        }
        if (
            coupon.usageLimit !== null &&
            coupon.usedCount >= coupon.usageLimit
        ) {
            return res.status(400).json({
                success: false,
                message: "Coupon usage limit reached"
            });
        }
        if (orderAmount < coupon.minOrderAmount) {
            return res.status(400).json({
                success: false,
                message: `Minimum order amount is ${coupon.minOrderAmount}`
            });
        }
        let discount = 0;
        if (coupon.discountType === "percentage") {
            discount =
                (orderAmount * coupon.discountvalue) / 100;
        } else if (coupon.discountType === "fixed") {
            discount = coupon.discountvalue;
        }
        if (coupon.minDiscount > 0) {
            discount = Math.max(discount, coupon.minDiscount);
        }
        if (coupon.maxDiscount !== null) {
            discount = Math.min(discount, coupon.maxDiscount);
        }
        discount = Math.min(discount, orderAmount);
        const finalAmount = orderAmount - discount;
        return res.status(200).json({
            success: true,
            message: "Coupon applied successfully",
            data: {
                couponCode: coupon.code,
                orderAmount,
                discount,
                finalAmount
            }
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
const getCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            data: coupons
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
const deleteCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        const coupon = await Coupon.findByIdAndDelete(id);
        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Coupon not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Coupon deleted successfully"
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
const toggleCouponStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const coupon = await Coupon.findById(id);
        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Coupon not found"
            });
        }
        coupon.isActive = !coupon.isActive;
        await coupon.save();
        return res.status(200).json({
            success: true,
            message: `Coupon ${coupon.isActive ? "activated" : "deactivated"} successfully`,
            coupon
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
module.exports = {
    createCoupon,
    verifyCoupon,
    getCoupons,
    deleteCoupon,
    toggleCouponStatus
};