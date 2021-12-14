const express = require("express");
const {
  createNewOrder,
  getMyOrders,
  getAllOrders,
  getOrder,
  deleteOrder,
  updateOrder,
} = require("../controllers/orderController");
const {
  isAuthenticated,
  authorizeRoles,
} = require("../middleware/authMiddleware");
const router = express.Router();

router.route("/new").post(isAuthenticated, createNewOrder);

router.route("/me/all").get(isAuthenticated, getMyOrders);

router.route("/:id").get(isAuthenticated, getOrder);

router
  .route("/admin/all")
  .get(isAuthenticated, authorizeRoles("Admin"), getAllOrders);

router
  .route("/admin/:id")
  .delete(isAuthenticated, authorizeRoles("Admin"), deleteOrder)
  .put(isAuthenticated, authorizeRoles("Admin"), updateOrder);

module.exports = router;
