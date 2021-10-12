const router=require('express').Router();
const ProductCtrl=require("../controllers/productCtrl.js")


router.route("/products")
.get(ProductCtrl.getProducts)
.post(ProductCtrl.createProduct)

router.route("/products/:id")
.delete(ProductCtrl.deleteProduct)
.put(ProductCtrl.updateProduct)

module.exports=router;