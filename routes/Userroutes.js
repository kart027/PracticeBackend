const express = require("express");
const router = express.Router();
const { register,login,logout,getMyprofile,changepassword ,Updateprofile,Updateprofilepictu,forgetpassword,resetpassword, getallUser,updateUserrole, deleteUser,deleteMyprofile} = require("../controllers/UserConstroller")
const {  isAuthenticated,isAuthorizedadmin }  = require("../middlewares/auth")
const singleupload = require("../middlewares/multer")
 

router.route("/register").post(singleupload,register)
router.route("/login").post(login)  
router.route("/logout").get(logout)  
router.route("/getmyprofile").get(isAuthenticated,getMyprofile)  
router.route("/deletemyProfile").get(isAuthenticated,deleteMyprofile)  
router.route("/changepassword").put(isAuthenticated,changepassword)  
router.route("/updateprofile").put(isAuthenticated,Updateprofile)  
router.route("/updateprofilepicture/:id").put(isAuthenticated,singleupload,Updateprofilepictu)  
router.route("/forgetPassword").post(forgetpassword)  
router.route("/resetpassword/:token").put(resetpassword)
// Admin routes

router.route("/admin/users").get(isAuthenticated,isAuthorizedadmin,getallUser)
router.route("/admin/users/:id").get(isAuthenticated,isAuthorizedadmin,updateUserrole)
router.route("/admin/users/deleteusers/:id").delete(isAuthenticated,isAuthorizedadmin,deleteUser)
module.exports = router;

