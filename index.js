const express = require("express")
const app = express();
const bodyParser = require("body-parser")
const cookie = require("cookie-parser")
const cloudinary = require("cloudinary")
const { connectDb } = require("./config/database")
const nodecron = require("node-cron")
const razorpay = require("razorpay")
const Stats = require("./models/Stats")
const cors = require("cors")
require("dotenv").config({
    path:"./config/config.env"
});
const morgan = require('morgan');
const ErrorMiddleware = require("./middlewares/Error")
app.use(express.json());
morgan.token('host', function (req, res) {
    return req.hostname;
});

app.use(morgan(':method :host :status :res[content-length] - :response-time ms'))
app.use(cookie())
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors({
    origin:"https://frontend-ochre-tau.vercel.app",
    credentials:true,
    methods:["GET","PUT","POST","DELETE"]
}))

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

nodecron.schedule("0 0 0 1 * *", async()=>{
    try {
        await Stats.create({})
    } catch (error) {
        console.log(error)
    }
})

const userroute = require("./routes/Userroutes");
const courseroute = require("./routes/CourseRoutes");
const paymentroutes = require("./routes/paymentroutes")
const otherroutes = require("./routes/Otherroutes")

app.use("/user",userroute);
app.use("/course",courseroute)
app.use("/payment",paymentroutes)
app.use("/other",otherroutes)
app.use(ErrorMiddleware);


app.listen(process.env.PORT,()=>{
    console.log("working")
})
