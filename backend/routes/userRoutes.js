const express = require("express");
const {
  registerUser,
  logout,
  loginUser,
} = require("../controllers/userController");
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").get(loginUser);
router.route("/logout").get(logout);

module.exports = router;
