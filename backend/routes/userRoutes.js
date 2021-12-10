const express = require("express");
const {
  registerUser,
  logout,
  loginUser,
  getPasswordResetLink,
  updatePassword,
} = require("../controllers/userController");
const { isAuthenticated } = require("../middleware/authMiddleware");
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").get(loginUser);
router.route("/logout").get(isAuthenticated, logout);

// Password Reset Routes
router.route("/password/forgot").get(getPasswordResetLink);
router.route("/password/reset/:resetToken").put(updatePassword);

module.exports = router;
