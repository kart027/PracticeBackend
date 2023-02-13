const express = require("express")
const app = express();
const bodyParser = require("body-parser")
const cookie = require("cookie-parser")
const cloudinary = require("cloudinary")
const { connectDb } = require("./config/database")
const razorpay = require("razorpay")
require("dotenv").config({
    path:"./config/config.env"
});
const ErrorMiddleware = require("./middlewares/Error")
app.use(express.json());
app.use(cookie())
app.use(bodyParser.urlencoded({extended:true}));

connectDb();

cloudinary.v2.config({
    cloud_name:process.env.cloud_name,
    api_key:process.env.api_key,
    api_secret:process.env.api_secret,
})

exports.instance = new razorpay({
    key_id:process.env.key_id,
    key_secret:process.env.key_secret
})

const userroute = require("./routes/Userroutes");
const courseroute = require("./routes/Courseroutes");
const paymentroutes = require("./routes/paymentroutes")

app.use("/user",userroute);
app.use("/course",courseroute)
app.use("/payment",paymentroutes)
app.use(ErrorMiddleware);


app.listen(process.env.PORT,()=>{
    console.log("workin")
})
