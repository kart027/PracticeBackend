const express = require("express");
const {  isAuthenticated ,isAuthorizedadmin }  = require("../middlewares/auth")

const router = express.Router();


router.route("/contact").post(contact)

module.exports = router;