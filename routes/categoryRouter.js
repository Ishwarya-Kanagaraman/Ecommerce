const router = require("express").Router();
const categoryCtrl = require("../controllers/categoryCtrl.js");
const auth = require("../middleware/auth.js");
const authAdmin = require("../middleware/authAdmin.js");

router
  .route("/category")
  .get(categoryCtrl.getCategories)

  .post(  auth,authAdmin,categoryCtrl.createCategory)

 router.route('/category/:id')
    .delete(auth,authAdmin,categoryCtrl.deleteCategory)
    .put(auth,authAdmin,categoryCtrl.updateCategory)


module.exports = router;
