const express = require("express");
const {
  getAllProducts,
  createNewProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  getAllProductsAdmin,
} = require("../controllers/productController");
const {
  isAuthenticated,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Get All Products (User)
router.route("/").get(isAuthenticated, authorizeRoles("Admin"), getAllProducts);

// Get All Products (Admin)
router
  .route("/admin/")
  .get(isAuthenticated, authorizeRoles("Admin"), getAllProductsAdmin);

// Create New Product
router.route("/new").post(isAuthenticated, createNewProduct);

// Product Specific Routes
router
  .route("/:id")
  .get(getSingleProduct)
  .put(isAuthenticated, authorizeRoles("Admin"), updateProduct)
  .delete(isAuthenticated, authorizeRoles("Admin"), deleteProduct);

module.exports = router;
