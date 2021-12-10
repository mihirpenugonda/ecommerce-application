const jsonwebtoken = require("jsonwebtoken");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrorsMiddleware");
const User = require("../models/userModel");

exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return next(new ErrorHandler("Please Login to access this resource"), 401);
  }

  const decodedData = jsonwebtoken.verify(token, process.env.JWT_TOKEN_KEY);
  const user = await User.findById(decodedData.id);

  req.user = user;
  next();
});

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.user.role} not authorized to access this resource`,
          403
        )
      );
    }

    next();
  };
};
