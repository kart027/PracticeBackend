const { CatchAsyncError } = require("../middlewares/CatchAsyncError");
const  ErrorHandler  = require("../utils/Errorhandler");
const User = require("../models/Usermodels");
const crypto = require("crypto")
const Payment = require("../models/Payment")

const {instance} = require("../index")

exports.Buysubscritption = CatchAsyncError(async(req,res,next)=>{
    const user = await User.findById(req.user._id);

    if(user.role== "admin"){
        return next(new ErrorHandler("admin cannot buy",400))
    }

    const planid = process.env.plan_id;
   const subscription =  await   instance.subscriptions.create({
            plan_id:planid,
            customer_notify:1,
            total_count:12
        });

        user.subscription.id = subscription.id;

        user.subscription.status = subscription.status;

      await  user.save()


        res.status(200).json({
            sucess:true,
            subscription
        })

})

exports.paymentVerification = CatchAsyncError(async(req,res,next)=>{
    const {razorpay_signature, razorpay_payment_id,razorpay_subscription_id} = req.body;
    console.log(req.body)

    const user = await User.findById(req.user._id);

    const subscription_id = user.subscription_id;

    const generated_signature = crypto.createHmac("sha256", process.env.Key_secret).update(razorpay_payment_id+"|"+ subscription_id,"utf-8").digest("hex");


    const isAuthentic =  generated_signature===razorpay_signature;

    if(!isAuthentic){
        return res.redirect(`${process.env.frontenUrl}/paymentfail`)
    }

    await Payment.create({
        razorpay_signature,
        razorpay_payment_id,
        razorpay_subscription_id
    })

     user.subscription.status = "active";

     await user.save();

     res.redirect(`${process.env.frontenUrl}/paymentsuccess?refrence=${razorpay_payment_id}`)
     })


     exports.getRazorpayKey = CatchAsyncError(async(req,res,next)=>{
        res.status(200).json({
            sucess:true,
            key:process.env.key_id
        })
     })
     exports.CancelSubcsription = CatchAsyncError(async(req,res,next)=>{

        const user = await User.findById(req.user._id);

        const subscriptionId = user.subscription.id;
        let refund = false;

        await instance.subscriptions.cancel(subscriptionId);

        const payment = await Payment.findOne({
            razorpay_subscription_id:subscriptionId
        })

            const gap = Date.now()-payment.created_at;

            const refundTime = process.env.REFUNDAYS*24*60*60*1000;

        if(refundTime > gap){
            await instance.payments.refund(payment.razorpay_payment_id);
            return true;
        }

        await payment.remove();

        user.subscription_id=undefined;
        user.subscription.status = undefined;
        res.status(200).json({
            sucess:true,
            message:"Subscription cancelled,You will recive full payment"
        })


     })
