const catchAsyncErrors = require("../middleware/catchAsyncErrorsMiddleware");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");

exports.createNewOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingDetails,
    orderItems,
    paymentDetails,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = req.body;

  paymentDetails.paidAt = Date.now();

  const newOrder = await Order.create({
    shippingDetails,
    orderItems,
    paymentDetails,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    user: req.user._id,
  });

  if (!newOrder) return next(new ErrorHandler("Error Creating Order", 401));

  res.status(200).json({
    success: true,
    newOrder,
  });
});

exports.getMyOrders = catchAsyncErrors(async (req, res, next) => {
  let orders = [];

  orders = await Order.find({ user: req.user._id }).populate(
    "user",
    "name email"
  );

  if (orders.length == 0)
    res.status(200).json({ success: true, message: "No Orders Placed" });

  res.status(200).json({ success: true, order: orders });
});

exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  let orders = [];

  orders = await Order.find().populate("user", "name email");

  if (orders.length == 0)
    res.status(200).json({ success: true, message: "No Orders Placed" });

  res.status(200).json({ success: true, order: orders });
});

exports.getOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) return next(new ErrorHandler("Order Not Found", 404));
  res.status(200).json({ success: true, order: order });
});

exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  await order.remove();

  res.status(200).json({
    success: true,
  });
});

exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  if (order.orderStatus == "Delivered")
    return next(new ErrorHander("You have already delivered this order", 400));

  if (req.body.status === "Shipped") {
    order.orderItems.forEach(async (o) => {
      await updateStock(o.product, o.itemQuantity);
    });
  }
  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);

  console.log(quantity);

  product.stock -= quantity;

  if (product.stock < 0)
    return next(new ErrorHandler("Error: Not Enough Stock", 400));

  await product.save({ validateBeforeSave: false });
}
