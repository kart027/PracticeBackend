const express = require("express");
const {  isAuthenticated ,isAuthorizedadmin }  = require("../middlewares/auth")
const {Buysubscritption,paymentVerification,getRazorpayKey,CancelSubcsription} = require("../controllers/PaymentControllers")
const router = express.Router();

// buy subscribetion

router.route("/subscribe").get(isAuthenticated,Buysubscritption)
router.route("/paymentverification").post(isAuthenticated,paymentVerification)
router.route("/razorpayKey").get(getRazorpayKey)

router.route("/Cancelsubscribe").delete(isAuthenticated,CancelSubcsription)

// Cancel subscription



module.exports = router;