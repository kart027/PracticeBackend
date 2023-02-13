const express = require("express");
const router = express.Router();
const {  isAuthenticated ,isAuthorizedadmin ,isAuthorizeSubscriber}  = require("../middlewares/auth")
const singleupload = require("../middlewares/multer")
 
const { createCourse,getALLcourses,addtoPlaylist,removefromPlayist,getcourselecture,addcourselecture,DeleteCourse,DeleteLecture} = require("../controllers/CourseControllers")


router.route("/getALLcourser").get(getALLcourses);
router.route("/createcourser").post(isAuthenticated,isAuthorizedadmin,singleupload,createCourse);
router.route("/addtoplayist").post(isAuthenticated,addtoPlaylist)
router.route("/removefromplayist").delete(isAuthenticated,removefromPlayist)
router.route("/getcourselecture/:id").get(isAuthenticated,isAuthorizeSubscriber,getcourselecture)
router.route("/addcourselectures/:id").post(isAuthenticated,isAuthorizedadmin,singleupload,addcourselecture)
router.route("/deletecourse/:id").delete(isAuthenticated,isAuthorizedadmin,DeleteCourse);
router.route("/deletelecture/:id").delete(isAuthenticated,isAuthorizedadmin,DeleteLecture);

module.exports = router;