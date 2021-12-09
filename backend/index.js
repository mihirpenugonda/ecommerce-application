const app = require("./app");
const dotenv = require("dotenv");
const { connectDatabase } = require("./config/database");

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("shutting down server due to unhandled exception");

  server.close(() => {
    process.exit();
  });
});

dotenv.config({ path: "./backend/config/config.env" });
connectDatabase();

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is working on http://localhost:${process.env.PORT}`);
});

// Handling Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("shutting down server due to unhandled promise rejection");

  server.close(() => {
    process.exit();
  });
});
