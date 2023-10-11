const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({

    title:{
        type:String,
        required:[true,"Please enter tittle"],
        minlength:[4,"Minimum length should be 4"],
        maxlength:[80,"Maximum length allowed should be 80"]
    },
    description:{
        type:String,
        required:[true,"Please enter course description"],
        minlength:[4,"Minimum length should be 4"],
        
    },
   lectures :[
        {
        title:{
            type:String,
            required :true
        },
        description:{
            type:String,
            required :true
        },
        public_id:{
            type:String,
            required:true,
        },
        url:{
            type:String,
            required:true
        }
    }
    ],
    poster:{
        public_id:{
            type:String,
            required:true,
        },
        url:{
            type:String,
            required:true
        }
    },
    views:{
        type:Number,
        default:0
    },
    numofVideos:{
        type:Number,
        default:0
    },
    category:{
        type:String,
        required:true
    },
    createdBy:{
        type:String,
        required:[true,"Enter course creator name"]
    },
    created_at:{
        type:Date,
        default:Date.now
    }

})


module.exports = new mongoose.model('Course',CourseSchema);