const router=require('express').Router();
const paymentCtrl=require("../controllers/paymentCtrl.js")
const auth=require("../middleware/auth.js")
const authAdmin=require("../middleware/authAdmin.js")


router.route('/payment')
.get(auth,authAdmin,paymentCtrl.getPayments)
.post(auth,paymentCtrl.createPayment)

module.exports = router;