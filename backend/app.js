const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

// Import Routes
const products = require("./routes/productRoutes");
const user = require("./routes/userRoutes");

// Import Middleware
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

app.use("/api/products", products);
app.use("/api/user", user);
app.use(errorMiddleware);

module.exports = app;
