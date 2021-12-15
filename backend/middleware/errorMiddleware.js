const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  console.log(err);

  if (err.name == "CastError") {
    const message = `Resource not found, Invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  if (err.name == "TokenExpiredError") {
    err = new ErrorHandler("JsonWebToken has Expired", 400);

    return res
      .cookie("token", null, {
        expires: new Date(Date.now()),
      })
      .status(err.statusCode)
      .json({
        success: false,
        error: err.message,
      });
  }

  res.status(err.statusCode).json({
    success: false,
    error: err.message,
  });
};
