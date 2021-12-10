const mongoose = require("mongoose");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrorsMiddleware");
const ApiFeatures = require("../utils/apiFeatures");

// User Routes
exports.createNewProduct = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user._id;

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
  const resultsPerPage = 2;
  const productCount = await Product.countDocuments();

  const apiFeatures = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultsPerPage);
  const products = await apiFeatures.query;

  res.status(200).json({
    success: true,
    products,
  });
});

exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

exports.createReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler("Product Does not Exits"), 404);

  let totalRating = 0;
  let reviewUpdated = false;
  let totalReviews = 0;

  product.reviews.forEach((review) => {
    if (review.user == req.user._id) {
      review.rating = req.body.rating;
      review.comment = req.body.comment;
      reviewUpdated = true;
    }
    totalRating = totalRating + review.rating;
    totalReviews = totalReviews + 1;
  });

  if (!reviewUpdated) {
    product.reviews.push({
      user: req.user._id.toString(),
      rating: req.body.rating,
      comment: req.body.comment,
    });

    totalRating = totalRating + req.body.rating;
    totalReviews = totalReviews + 1;
  }

  console.log(product);
  console.log(totalRating, totalReviews);

  product.numOfReviews = totalReviews;
  product.rating = Number(totalRating / totalReviews);

  product.save({
    validateBeforeSave: false,
  });

  res.status(200).json("Review Added");
});

exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

exports.deleteProductReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const reviews = product.reviews.filter((review) => {
    review.user.toString() !== req.user._id.toString();
  });

  let totalReviews = reviews.length;
  let totalRating = 0;

  reviews.forEach((review) => {
    totalRating = totalRating + review.rating;
  });

  let rating = 0;
  totalReviews === 0 ? (rating = 0) : (rating = totalRating / totalReviews);

  await Product.findByIdAndUpdate(
    req.params.id,
    {
      reviews: reviews,
      numOfReviews: totalReviews,
      rating: rating,
    },
    {
      runValidators: true,
    }
  );

  res.status(200).json("Review Deleted");
});

// Admin Routes
exports.getAllProductsAdmin = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    products,
  });
});

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body
  );
  res.status(200).json({
    success: true,
    updatedProduct,
  });
});

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }

  await Product.findByIdAndDelete(req.params.id).then(() => {
    res.status(200).json({
      success: true,
      message: "Product Deleted",
    });
  });
});
