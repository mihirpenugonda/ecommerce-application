const User = require("../models/userModel");
const catchAsyncError = require("../middleware/catchAsyncErrorsMiddleware");

const bcrypt = require("bcryptjs");
const ErrorHandler = require("../utils/errorHandler");
const { sendToken } = require("../utils/jwtToken");

exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, username, email, password } = req.body;

  const user = await User.create({
    name,
    username,
    email,
    password,
    avatar: {
      public_id: "User Avatar",
      url: "Dummy Url",
    },
  });

  sendToken(user, 201, res);
});

exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Enter Both Email and Password", 401));
  }

  const user = await User.findOne({
    email,
  }).select("+password");

  const isCorrectPassword = user.matchPassword(password);

  if (!isCorrectPassword) return next(new ErrorHandler("Wrong Password", 401));

  sendToken(user, 200, res);
});

exports.logout = catchAsyncError(async (req, res, next) => {
  const token = req.cookies.token;

  res
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
    });
});
