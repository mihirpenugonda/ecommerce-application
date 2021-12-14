const express = require("express");
const {
  registerUser,
  logout,
  loginUser,
  getPasswordResetLink,
  updatePassword,
  passwordResetUpdate,
  getUser,
  updateUser,
  getAllUser,
  updateRole,
  deleteUser,
} = require("../controllers/userController");
const {
  isAuthenticated,
  authorizeRoles,
} = require("../middleware/authMiddleware");
const router = express.Router();

// User Basic Routes
router.route("/register").post(registerUser);
router.route("/login").get(loginUser);
router.route("/logout").get(isAuthenticated, logout);

// Password Reset Routes
// Send Reset Link to Email
router.route("/password/forgot").get(getPasswordResetLink);
// Update Password using Reset Link
router.route("/password/reset/:resetToken").put(passwordResetUpdate);

// User Updating Routes
// Update User Password
router.route("/password/update").put(isAuthenticated, updatePassword);
// Get - Getting User Details Put - Updating User Details
router
  .route("/me")
  .get(isAuthenticated, getUser)
  .put(isAuthenticated, updateUser);

// Admin Routes
// Get All Users
router
  .route("/admin/all")
  .get(isAuthenticated, authorizeRoles("Admin"), getAllUser);
// Get - Getting User Details Put - Updating User Role Delete - Delete User
router
  .route("/admin/:id")
  .get(isAuthenticated, authorizeRoles("Admin"), getUser)
  .put(isAuthenticated, authorizeRoles("Admin"), updateRole)
  .delete(isAuthenticated, authorizeRoles("Admin"), deleteUser);

module.exports = router;
