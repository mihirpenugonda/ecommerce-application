const express = require("express");
const {
  getAllProducts,
  createNewProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  getAllProductsAdmin,
  createReview,
  getAllReviews,
  getProductReviews,
  deleteProductReview,
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

// Create and Delete Product Review
router
  .route("/:id/review")
  .post(isAuthenticated, createReview)
  .delete(isAuthenticated, deleteProductReview);

// Get All Product Reviews
router.route("/:id/reviews").get(getSingleProduct);

// Create New Product
router.route("/new").post(isAuthenticated, createNewProduct);

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
