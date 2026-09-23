const moongose = require('mongoose');
const couponSchema = moongose.Schema({
    code:{
        type:String,
        required:true,
        unique:true,
        uppercase:true
    },
    discountType:{
        type:String,
        enum:["percentage","fixed"],
        required:true
    },
    discountvalue:{
        type:Number,
        required:true,
        min:0
    },
    minOrderAmount: {
      type: Number,
      default: 0,
    },
    maxDiscount:{
        type:Number,
        default:null
    },
    minDiscount:{
        type:Number,
        default:0
    },
    usageLimit:{
        type:Number,
        default:null
    },
    usedCount:{
        type:Number,
        default:0
    },
    expiresAt:{
          type:Date,
        required:true
    },
    isActive:{
        type:Boolean,
        default:true
    }
},{
    timestamps:true
});
module.exports = moongose.model("Coupon",couponSchema);