const express = require("express");
const {  isAuthenticated ,isAuthorizedadmin }  = require("../middlewares/auth")
const {contact}= require("../controllers/OtherControllers")

const router = express.Router();


router.route("/contact").post(contact)


module.exports = router;