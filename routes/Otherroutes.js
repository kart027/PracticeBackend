const express = require("express");
const {  isAuthenticated ,isAuthorizedadmin }  = require("../middlewares/auth")
const {contact,getDashboardStats}= require("../controllers/OtherControllers")

const router = express.Router();


router.route("/contact").post(contact)
router.route("/admin/stats").get(getDashboardStats)


module.exports = router;