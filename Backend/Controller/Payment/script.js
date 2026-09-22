const Razorpay = require('razorpay');
const crypto = require('crypto');
const razorpay = new Razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRET
})
const createOrder = async (req,res)=>{
    try{
        const {amount} = req.body
        if(!amount || !Number.isFinite(Number(amount)) || Number(amount)<=0 ){
            return res.status(401).json({
                success:false,
                message:"Invalid Amount"
            })
        }
        const orders = await razorpay.orders.create({
            amount:Math.round(Number(amount)*100),
            currency:"INR",
            receipt:"receipt" + Date.now()
        })
        res.status(201).json({
            status:true,
            orders,
            key:process.env.RAZORPAY_KEY_ID
        })
    }catch(err){
        res.status(500).json({
            success:false,
            message:err.message
        })
    }
}
const verifyPayment = async (req,res)=>{
    try{
        const{razorpay_order_id,razorpay_payment_id,razorpay_signature} = req.body;
        const generateSignature = crypto.createHmac("sha256",process.env.RAZORPAY_KEY_SECRET).update(razorpay_order_id + "|" +razorpay_payment_id).digest("hex")
        if(generateSignature !== razorpay_signature){
            return  res.status(400).json({
                success:false,
                message:"Payment Verification failed"
            })
        }
        res.status(201).json({
            success:true,
            message:"Payment verified successfully"
        })
    }catch(err){
        res.status(500).json({
            success:false,
            message:err.message
        })
    }
}
module.exports = {createOrder,verifyPayment}