const mongoose = require("mongoose");

exports.connectDb =  ()=>{
    mongoose.connect(process.env.MONGO_URL)
    .then((c)=>console.log("database connected")).catch((error)=>console.log(error))
};