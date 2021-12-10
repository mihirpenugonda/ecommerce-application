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

// Get All Products
router.route("/").get(isAuthenticated, getAllProducts);

// Get Specific Product
router.route("/:id").get(getSingleProduct);

// Create New Product
router.route("/new").post(isAuthenticated, createNewProduct);

// Review Routes
// Create Review
router.route("/review");
// Delete and Get Reviews
router.route("/reviews");

// Get All Products (Admin)
router
  .route("/admin")
  .get(isAuthenticated, authorizeRoles("Admin"), getAllProductsAdmin);

// Product Specific Routes (Admin)
router
  .route("admin/:id")
  .put(isAuthenticated, authorizeRoles("Admin"), updateProduct)
  .delete(isAuthenticated, authorizeRoles("Admin"), deleteProduct);

module.exports = router;
