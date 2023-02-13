const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
    razorpay_signature:{
        type:String,
        required:true
    },
    razorpay_payment_id:{
        type:String,
        required:true
    },
    razorpay_subscription_id:{
        type:String,
        required:true
    },

    created_at:{
        type:Date,
        default:Date.now,
    }
  
})


module.exports = new mongoose.model('Payment',PaymentSchema);