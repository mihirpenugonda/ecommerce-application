const User = require("../models/userModel");
const catchAsyncError = require("../middleware/catchAsyncErrorsMiddleware");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const ErrorHandler = require("../utils/errorHandler");
const { sendToken } = require("../utils/jwtToken");
const { sendEmail } = require("../utils/sendEmail");

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

  const isCorrectPassword = await user.matchPassword(password);
  console.log(isCorrectPassword);

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

exports.getPasswordResetLink = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorHandler(`User with ${email} does not exist`), 404);
  }

  const resetToken = user.getResetPasswordToken();

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/password/reset/${resetToken}`;

  const message = `your password reset link has been generated :- \n\n${resetUrl} \n\nplease ignore this message if you have not requested password reset`;

  await user.save();

  try {
    sendEmail({
      message: message,
      to: email,
      subject: "ECommerce Recovery Password",
    });

    res.status(200).json("Password Reset link Sent");
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

exports.updatePassword = catchAsyncError(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: {
      $gt: Date.now(),
    },
  });

  if (!user) {
    return next(
      new ErrorHander(
        "Reset Password Token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword)
    return next(new ErrorHandler("Password's do not match"), 400);

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});
